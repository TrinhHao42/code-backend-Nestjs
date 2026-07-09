import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gift } from './entities/gift.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
  ) {}

  async findAllAvailable(): Promise<Gift[]> {
    return this.giftRepository.find({
      where: { isAvailable: true },
    });
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

  async findAll(): Promise<Gift[]> {
    return this.giftRepository.find();
  }

  async update(
    id: string,
    updateGiftData: Partial<Gift>,
  ): Promise<Gift | null> {
    await this.giftRepository.update(id, updateGiftData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.giftRepository.delete(id);
    return result.affected !== 0;
  }
}
