import { Injectable } from '@nestjs/common';
import { Response } from './types/types';

@Injectable()
export class AppService {
  getHello(): Response {
    return {
      message: 'hello',
    };
  }
}
