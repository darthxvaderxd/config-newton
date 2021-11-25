import {
  Entity,
  Column,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  config_id: number;

  @Column()
  deployment_id: number;

  @Column()
  key: string;

  @Column()
  value: string;
}
