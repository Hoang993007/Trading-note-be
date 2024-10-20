import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Database, DatabaseSchema } from 'src/schemas/database.schema';
import {
  DatabaseData,
  DatabaseDataSchema,
} from 'src/schemas/database-data.schema';
import { DatabaseController } from './database.controller';
import * as services from './services';
import { autoImport } from 'src/shares/helpers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Database.name, schema: DatabaseSchema },
      { name: DatabaseData.name, schema: DatabaseDataSchema },
    ]),
  ],
  controllers: [DatabaseController],
  providers: [...autoImport(services)],
  exports: [...autoImport(services)],
})
export class DatabaseModule {}
