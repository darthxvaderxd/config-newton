import { getConnection } from './util/connection';
import { getDeployment } from './util/get-deployment';

const run = async () => {
  const deploymentName = process?.argv[2]?.toLowerCase() ?? '';

  if (deploymentName === '') {
    throw new Error('Deployment was empty');
  }

  const connection = await getConnection();
  const deployment = await getDeployment(connection, deploymentName);

  await connection.query(
    `delete from deployment_key where deployment_id = ${deployment.deployment_id}`,
  );

  await connection.close();
};

run()
  .then(() => console.log('script complete'))
  .catch((error) => console.error(error));
