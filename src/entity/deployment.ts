import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Deployment {
  @PrimaryGeneratedColumn()
    deployment_id: number;

  @Column()
    name: string;

  @Column({ default: false })
    secured: boolean;
}
