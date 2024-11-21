import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comparison } from 'src/schemas';
import { ComparisonSchema } from 'src/schemas/comparison.schema';
import { ComparisonController } from './comparison.controller';
import { ComparisonService } from './comparison.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comparison.name, schema: ComparisonSchema },
    ]),
  ],
  controllers: [ComparisonController],
  providers: [ComparisonService],
  exports: [ComparisonService],
})
export class ComparisonModule {}
