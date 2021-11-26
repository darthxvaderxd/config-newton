import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Config } from '../entity/config';
import { Deployment } from '../entity/deployment';
import { DeploymentKey } from '../entity/deployment-key';
import { Response } from '../types/types';

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
   * save the config, create a new one if it doesn't exist
   * @param deployment_id
   * @param key - the key name ie: MYSQL_HOST
   * @param value - the value we want stored ie: db
   * @private
   */
  private async saveConfig(deployment_id, key, value) {
    let config = await this.configRepository.findOne({
      deployment_id,
      key,
    });
    if (!config) {
      config = new Config();
      config.key = key;
      config.deployment_id = deployment_id;
    }
    config.value = value;
    return this.configRepository.save(config);
  }

  /**
   * ensure that the deployment key is valid for given environment
   * @param apiKey - the key given in the request headers
   * @param name - the name of the deployment we are validating against
   */
  async validateDeployment(apiKey: string, name: string): Promise<Deployment | null> {
    const deployment = await this.deploymentRepository.findOne({
      name,
    });
    if (deployment && !deployment.secured) {
      // if it is not set to secured we do not need a key
      return deployment;
    }
    if (deployment?.secured) {
      // required to validate the deployment key
      const deploymentKey = await this.deploymentKeyRepository.findOne({
        deployment_id: deployment.deployment_id,
        key: apiKey,
      });
      if (deploymentKey) {
        // deployment key is valid
        return deployment;
      }
    }
    return null;
  }

  /**
   * fetch all configs for a given deployment
   * @param deployment
   */
  async getDeployment(deployment: Deployment): Promise<Response> {
    const { deployment_id } = deployment;
    const results = await this.configRepository.find({ deployment_id });
    return {
      results,
    };
  }

  /**
   * update all the configs sent in the request
   * note: this will not clean up old ones if key
   * does not exist
   * @param deployment
   * @param body
   */
  async updateConfigForDeployment(
    deployment: Deployment,
    body: object,
  ): Promise<Response> {
    const { deployment_id } = deployment;
    const keys = Object.keys(body);
    try {
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const value = body[key];
        // eslint-disable-next-line no-await-in-loop
        await this.saveConfig(deployment_id, key, value); // shh this is our secret
      }
    } catch (error) {
      throw new BadRequestException({
        error,
      });
    }
    const results = await this.configRepository.find({ deployment_id });
    return {
      results,
    };
  }

  /**
   * get a specific configuration for a deployment for a given key
   * @param deployment
   * @param key
   */
  async getDeploymentConfig(
    deployment: Deployment,
    key: string,
  ): Promise<Response> {
    const { deployment_id } = deployment;
    const results = await this.configRepository.findOne({
      deployment_id,
      key,
    });
    if (!results) {
      throw new NotFoundException({
        error: 'invalid config',
      });
    }
    return {
      results,
    };
  }

  /**
   * update / create a specific config for a deployment
   * @param deployment
   * @param key
   * @param value
   */
  async updateConfigForDeploymentConfig(
    deployment: Deployment,
    key: string,
    value: string,
  ): Promise<Response> {
    const { deployment_id } = deployment;
    await this.saveConfig(deployment_id, key, value);
    const results = await this.configRepository.findOne({
      deployment_id,
      key,
    });
    return {
      results,
    };
  }
}
