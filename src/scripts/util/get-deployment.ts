import { Deployment } from "../../entity/deployment";

export const getDeployment = async (connection, deploymentName) => {
  const deploymentRepository = connection.getRepository(Deployment);
  const deployment = await deploymentRepository.findOne({
    name: deploymentName,
  });

  if (!deployment) {
    throw new Error('Deployment does not exist');
  }

  return deployment;
}
