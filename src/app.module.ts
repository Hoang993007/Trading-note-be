import { Module } from '@nestjs/common';
import { ComparisonModule } from './modules/comparison/comparison.module';
import { DatabaseModule } from './modules/database/database.module';
import { SharedModule } from './modules/shared/shared.module';

const appModules = [DatabaseModule, ComparisonModule];

@Module({
  imports: [SharedModule, ...appModules],
  providers: [],
})
export class AppModule {}
