import { getConnection } from './util/connection';
import { Deployment } from '../entity/deployment';
import { createDeploymentKey } from './util/create-deployment-key';

const run = async () => {
  const deploymentName = process?.argv[2]?.toLowerCase() ?? '';
  const secure = process.argv[3].toLowerCase() ?? '';

  if (deploymentName === '') {
    throw new Error('Deployment was empty');
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
    const deploymentKey = await createDeploymentKey(connection, deployment);
    console.log('deployment key created => ', deploymentKey.key);
  }
  await connection.close();
};

run()
  .then(() => console.log('script complete'))
  .catch((error) => console.error(error));
