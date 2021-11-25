import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from 'typeorm';
import { Config } from '../entity/config';
import { Deployment } from "../entity/deployment";
import { DeploymentKey } from "../entity/deployment-key";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "../types/types";

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private configRepository: Repository<Config>,
    @InjectRepository(Deployment)
    private deploymentRepository: Repository<Deployment>,
    @InjectRepository(DeploymentKey)
    private deploymentKeyRepository: Repository<DeploymentKey>,
  ) {}

  /**
   * ensure that the deployment key is valid for given environment
   * @param apiKey - the key given in the request headers
   * @param name - the name of the deployment we are validating against
   */
  async validateDeployment(apiKey: string, name: string): Promise<Deployment> {
    const deployment = await this.deploymentRepository.findOne({
      name,
    });
    if (deployment && !deployment.secured) { // if it is not set to secured we do not need a key
      return deployment;
    } else if (deployment?.secured) { // required to validate the deployment key
      const deploymentKey = await this.deploymentKeyRepository.findOne({
        deployment_id: deployment.deployment_id,
        key: apiKey,
      });
      if (deploymentKey) { // deployment key is valid
        return deployment;
      }
    }
    return null;
  }

  async getDeployment(deployment: Deployment): Promise<Response> {
    const { deployment_id } = deployment;
    const results = await this.configRepository.find({ deployment_id })
    return {
      results,
    }
  }

  async getDeploymentConfig(deployment: Deployment, key: string): Promise<Response> {
    const { deployment_id } = deployment;
    const results = await this.configRepository.findOne({ deployment_id, key });
    if (!results) {
      throw new NotFoundException({
        error: 'invalid config',
      });
    }
    return {
      results,
    }
  }
}
