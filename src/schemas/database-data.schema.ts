import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import {
  TDatabaseData,
  TDatabaseDataValue,
} from 'src/shares/types/database.type';

export type DatabaseDataDocument = DatabaseData & Document;

@Schema({ _id: false, timestamps: false })
export class DatabaseDataValue implements TDatabaseDataValue {
  @Prop({ required: true, unique: true })
  propertyId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  value: any;
}

@Schema({ collection: 'database_data', timestamps: true })
export class DatabaseData implements TDatabaseData {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  databaseId: string;

  @Prop({ type: [Object], default: [] })
  values: TDatabaseDataValue[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const DatabaseDataSchema = SchemaFactory.createForClass(DatabaseData);
DatabaseDataSchema.index({ id: 1 }, { unique: true });
DatabaseDataSchema.plugin(MongoosePaginate);
