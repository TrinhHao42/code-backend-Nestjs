import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Gift } from '../../gifts/entities/gift.entity';
import { User } from '../../users/entities/user.entity';

export enum RedemptionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('redemptions')
export class Redemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string | null;

  @Column({ nullable: true })
  giftId: string | null;

  @Column({ type: 'int' })
  pointsUsed: number;

  @Column({ type: 'enum', enum: RedemptionStatus, default: RedemptionStatus.COMPLETED })
  status: RedemptionStatus;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ManyToOne(() => Gift, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'giftId' })
  gift: Gift | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
