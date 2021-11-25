import {
  Controller,
  Get,
  Headers, NotFoundException,
  Param
} from "@nestjs/common";
import { ConfigService } from './config.service';
import { ConfigRequest, Response } from "../types/types";
import { Deployment } from "../entity/deployment";

@Controller('configs')
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  private getDeployment(headers, params: ConfigRequest): Promise<Deployment> {
    const { deployment: deploymentName } = params;
    const { 'x-api-key': apiKey = '' } = headers;
    return this.service.validateDeployment(apiKey, deploymentName);
  }

  @Get(':deployment')
  async getConfigsForDeployment(@Headers() headers, @Param() params: ConfigRequest): Promise<Response> {
    const deployment = await this.getDeployment(headers, params);
    if (deployment) {
      return this.service.getDeployment(deployment);
    }
    throw new NotFoundException({
      error: 'invalid deployment',
    });
  }

  @Get(':deployment/:key')
  async getConfigForDeploymentWithConfig(@Headers() headers, @Param() params: ConfigRequest): Promise<Response> {
    const deployment = await this.getDeployment(headers, params);
    if (deployment) {
      const { key } = params;
      return this.service.getDeploymentConfig(deployment, key);
    }
    throw new NotFoundException({
      error: 'invalid deployment',
    });
  }
}
