import * as crypto from 'crypto';
import { Connection } from 'typeorm';
import { Deployment } from '../../entity/deployment';
import { DeploymentKey } from '../../entity/deployment-key';

export const createDeploymentKey = async (connection: Connection, deployment: Deployment) => {
  const keyRepository = connection.getRepository(DeploymentKey);
  const key = crypto.randomBytes(32).toString('hex');

  const deploymentKey = new DeploymentKey();
  deploymentKey.deployment_id = deployment.deployment_id;
  deploymentKey.key = key;
  await keyRepository.save(deploymentKey);

  return deploymentKey;
};
