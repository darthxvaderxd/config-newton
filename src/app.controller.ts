import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from './types/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Response {
    return this.appService.getHello();
  }
}
