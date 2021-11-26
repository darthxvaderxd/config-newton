import  { getConnection } from "./util/connection";
import { Deployment } from "../entity/deployment";
import { DeploymentKey } from "../entity/deployment-key";
import * as crypto from 'crypto';

const run = async () => {
  const deploymentName = process?.argv[2]?.toLowerCase() ?? '';
  const secure = process.argv[3].toLowerCase() ?? '';

  if (deploymentName === '') {
    throw new Error('Deployment was empty')
  }

  const connection = await getConnection();
  const deploymentRepository = connection.getRepository(Deployment);
  const deploymentCheck = await deploymentRepository.findOne({
    name: deploymentName,
  });

  if (deploymentCheck) {
    await connection.close();
    throw new Error('Deployment already exists');
  }

  const deployment = new Deployment();
  deployment.name = deploymentName;
  deployment.secured = secure === 'y';

  await deploymentRepository.save(deployment);

  console.log('deployment created => ', deployment);

  if (deployment.secured) {
    const keyRepository = connection.getRepository(DeploymentKey);
    const key = crypto.randomBytes(32).toString('hex');

    const deploymentKey = new DeploymentKey();
    deploymentKey.deployment_id = deployment.deployment_id;
    deploymentKey.key = key;
    await keyRepository.save(deploymentKey);
    console.log('deployment key created => ', deploymentKey.key);
  }
  connection.close();
};

run()
  .then(() => console.log('script complete'))
  .catch((error) => console.error(error));
