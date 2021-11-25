import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeploymentKey {
  @PrimaryGeneratedColumn()
    deployment_key_id: number;

  @Column()
    deployment_id: number;

  @Column()
    key: string;
}
