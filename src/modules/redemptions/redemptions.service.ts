import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ErrorMessages } from '../../common/constants/error-messages.constant';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Gift } from '../gifts/entities/gift.entity';
import { User } from '../users/entities/user.entity';

import { Redemption, RedemptionStatus } from './entities/redemption.entity';

@Injectable()
export class RedemptionsService {
  constructor(
    @InjectRepository(Redemption)
    private readonly redemptionRepository: Repository<Redemption>,
    private readonly dataSource: DataSource,
  ) {}

  async redeemGift(userId: string, giftId: string): Promise<Redemption> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Lấy thông tin User và Gift trong transaction (sử dụng pessimistic write lock để chống race condition)
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      const gift = await queryRunner.manager.findOne(Gift, {
        where: { id: giftId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
      }

      if (!gift) {
        throw new NotFoundException(ErrorMessages.GIFT_NOT_FOUND);
      }

      // 2. Kiểm tra điều kiện đổi quà
      if (!gift.isAvailable) {
        throw new BadRequestException(ErrorMessages.GIFT_NOT_FOUND_OR_HIDDEN);
      }

      if (gift.stock <= 0) {
        throw new BadRequestException(ErrorMessages.GIFT_OUT_OF_STOCK);
      }

      if (user.points < gift.pointsRequired) {
        throw new BadRequestException(ErrorMessages.INSUFFICIENT_POINTS);
      }

      // 3. Thực hiện khấu trừ điểm và kho
      user.points -= gift.pointsRequired;
      gift.stock -= 1;

      await queryRunner.manager.save(User, user);
      await queryRunner.manager.save(Gift, gift);

      // 4. Tạo bản ghi giao dịch đổi quà
      const redemption = queryRunner.manager.create(Redemption, {
        userId: user.id,
        giftId: gift.id,
        pointsUsed: gift.pointsRequired,
        status: RedemptionStatus.COMPLETED,
      });

      const savedRedemption = await queryRunner.manager.save(Redemption, redemption);

      await queryRunner.commitTransaction();

      // Nạp quan hệ để trả về dữ liệu đầy đủ
      const result = await this.redemptionRepository.findOne({
        where: { id: savedRedemption.id },
        relations: { gift: true },
      });

      if (!result) {
        throw new NotFoundException(ErrorMessages.REDEMPTION_NOT_FOUND);
      }

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllForUser(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<{ data: Redemption[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const [data, total] = await this.redemptionRepository.findAndCount({
      where: { userId },
      relations: { gift: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findAllAdmin(query: PaginationQueryDto): Promise<{ data: Redemption[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const [data, total] = await this.redemptionRepository.findAndCount({
      relations: { user: true, gift: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async updateStatus(id: string, status: RedemptionStatus): Promise<Redemption> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const redemption = await queryRunner.manager.findOne(Redemption, {
        where: { id },
        relations: { user: true, gift: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!redemption) {
        throw new NotFoundException(ErrorMessages.REDEMPTION_NOT_FOUND);
      }

      // Nếu trạng thái mới là CANCELLED và trạng thái cũ khác CANCELLED ➔ Hoàn điểm và hoàn kho
      if (
        status === RedemptionStatus.CANCELLED &&
        redemption.status !== RedemptionStatus.CANCELLED
      ) {
        if (redemption.user) {
          redemption.user.points += redemption.pointsUsed;
          await queryRunner.manager.save(User, redemption.user);
        }

        if (redemption.gift) {
          redemption.gift.stock += 1;
          await queryRunner.manager.save(Gift, redemption.gift);
        }
      }

      redemption.status = status;
      const updatedRedemption = await queryRunner.manager.save(Redemption, redemption);

      await queryRunner.commitTransaction();

      return updatedRedemption;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
