import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigRequest, Response } from '../types/types';
import { Deployment } from '../entity/deployment';

// /configs
@Controller('configs')
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  private async getDeployment(
    headers,
    params: ConfigRequest,
  ): Promise<Deployment> {
    const { deployment: deploymentName } = params;
    const { 'x-api-key': apiKey = '' } = headers;
    const deployment = await this.service.validateDeployment(
      apiKey,
      deploymentName,
    );
    if (deployment) {
      return deployment;
    }
    throw new NotFoundException({
      error: 'invalid deployment',
    });
  }

  // GET /configs/:deployment
  @Get(':deployment')
  async getConfigsForDeployment(
    @Headers() headers,
      @Param() params: ConfigRequest,
  ): Promise<Response> {
    const deployment = await this.getDeployment(headers, params);
    return this.service.getDeployment(deployment);
  }

  // POST /configs/:deployment
  @Post(':deployment')
  async updateConfigForDeployment(
    @Headers() headers,
      @Param() params: ConfigRequest,
      @Body() body,
  ): Promise<Response> {
    const deployment = await this.getDeployment(headers, params);
    if (typeof body === 'object') {
      return this.service.updateConfigForDeployment(deployment, body);
    }
    throw new BadRequestException({
      error: 'invalid body in post',
    });
  }

  // GET /configs/:deployment/:key
  @Get(':deployment/:key')
  async getConfigForDeploymentWithConfig(
    @Headers() headers,
      @Param() params: ConfigRequest,
  ): Promise<Response> {
    const deployment = await this.getDeployment(headers, params);
    const { key } = params;
    return this.service.getDeploymentConfig(deployment, key);
  }

  // POST /configs/:deployment/:key
  @Post(':deployment/:key')
  async updateConfigForDeploymentWithConfig(
    @Headers() headers,
      @Param() params: ConfigRequest,
      @Body() body,
  ): Promise<Response> {
    const deployment = await this.getDeployment(headers, params);
    const { key } = params;
    const { value } = body;
    return this.service.updateConfigForDeploymentConfig(deployment, key, value);
  }
}
