import { getConnection } from "./util/connection";
import { createDeploymentKey } from "./util/create-deployment-key";
import { getDeployment } from "./util/get-deployment";

const run = async () => {
  const deploymentName = process?.argv[2]?.toLowerCase() ?? '';

  if (deploymentName === '') {
    throw new Error('Deployment was empty')
  }

  const connection = await getConnection();
  const deployment = await getDeployment(connection, deploymentName);

  if (!deployment) {
    await connection.close();
    throw new Error('Deployment does not exist');
  }

  if (deployment.secured) {
    const deploymentKey = await createDeploymentKey(connection, deployment);
    console.log('deployment key created => ', deploymentKey.key);
  } else {
    console.log('deployment is not secured, no key needed');
  }

  await connection.close();
};

run()
  .then(() => console.log('script complete'))
  .catch((error) => console.error(error));
