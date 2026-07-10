import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Gift } from '../gifts/entities/gift.entity';
import { User } from '../users/entities/user.entity';

import { Redemption } from './entities/redemption.entity';
import { RedemptionsController } from './redemptions.controller';
import { RedemptionsService } from './redemptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Redemption, User, Gift])],
  controllers: [RedemptionsController],
  providers: [RedemptionsService],
  exports: [RedemptionsService],
})
export class RedemptionsModule {}
