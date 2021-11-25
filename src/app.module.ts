import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigController } from "./config/config.controller";
import { ConfigService } from "./config/config.service";
import { Config } from "./entity/config";
import { Deployment } from "./entity/deployment";
import { DeploymentKey } from "./entity/deployment-key";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process?.env?.MYSQL_HOST ?? 'localhost',
      port: Number(process?.env?.MYSQL_PORT ?? '3306'),
      username: process?.env?.MYSQL_USER ?? 'cfn',
      password: process?.env?.MYSQL_PASSWORD ?? 'catgifs',
      database: process?.env?.MYSQL_DATABASE ?? 'config_newton',
      entities: [Config, Deployment, DeploymentKey],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Config, Deployment, DeploymentKey]),
  ],
  exports: [TypeOrmModule],
  controllers: [AppController, ConfigController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
