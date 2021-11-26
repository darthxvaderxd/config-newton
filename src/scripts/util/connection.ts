import { createConnection, Connection } from 'typeorm';
import { Config } from '../../entity/config';
import { Deployment } from '../../entity/deployment';
import { DeploymentKey } from '../../entity/deployment-key';

export const getConnection = () : Promise<Connection> => createConnection({
  type: 'mysql',
  host: process?.env?.MYSQL_HOST ?? 'localhost',
  port: Number(process?.env?.MYSQL_PORT ?? '3306'),
  username: process?.env?.MYSQL_USER ?? 'cfn',
  password: process?.env?.MYSQL_PASSWORD ?? 'catgifs',
  database: process?.env?.MYSQL_DATABASE ?? 'config_newton',
  entities: [Config, Deployment, DeploymentKey],
});
