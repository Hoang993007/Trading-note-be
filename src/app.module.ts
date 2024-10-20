import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { SharedModule } from './modules/shared/shared.module';

const appModules = [DatabaseModule];

@Module({
  imports: [SharedModule, ...appModules],
  providers: [],
})
export class AppModule {}
