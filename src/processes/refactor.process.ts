// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DatabaseDataService } from 'src/modules/database/services';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const databaseDataService = app.get(DatabaseDataService);
  // await databaseDataService.castAllDateStringToTimestamp();
  // await databaseDataService.castDateUTCToNY();
  // await databaseDataService.castDateVNToUTC();
}
run();
