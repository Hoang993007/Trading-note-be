import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('shared')
@ApiTags('Shared')
export class SharedController {
  @Get('env')
  getEnvironment() {
    return {
      mode: process.env.NODE_ENV || 'DEV',
    };
  }
}
