import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Public } from '../decorators/route.decorator';

@Controller('health_check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
