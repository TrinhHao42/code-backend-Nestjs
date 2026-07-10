import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

import { Gift } from './entities/gift.entity';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
  ) {}

  async findAllAvailable(query: PaginationQueryDto): Promise<{ data: Gift[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const [data, total] = await this.giftRepository.findAndCount({
      where: { isAvailable: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Gift | null> {
    return this.giftRepository.findOne({
      where: { id },
    });
  }

  async create(createGiftData: Partial<Gift>): Promise<Gift> {
    const gift = this.giftRepository.create(createGiftData);
    return this.giftRepository.save(gift);
  }

  async findAll(query: PaginationQueryDto): Promise<{ data: Gift[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const [data, total] = await this.giftRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async update(id: string, updateGiftData: Partial<Gift>): Promise<Gift | null> {
    await this.giftRepository.update(id, updateGiftData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.giftRepository.delete(id);
    return result.affected !== 0;
  }
}
