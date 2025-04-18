import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  DONE = 'done',
  FAILED = 'failed',
  QUEUED = 'queued',
  PROCESSING = 'processing',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ default: TaskStatus.QUEUED, type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Column({ default: 0 })
  retries: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
