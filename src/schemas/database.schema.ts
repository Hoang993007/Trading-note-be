import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import {
  TDatabaseSortBy,
  TDatabaseProperty,
  EDatabasePropertyType,
  TDatabasePropertySettings,
  TDatabasePropertySettingsOption,
} from 'src/shares/types/database.type';

export type DatabaseDocument = Database & Document;

@Schema({ _id: false, id: false, timestamps: false })
export class DatabasePropertySettingsOption
  implements TDatabasePropertySettingsOption
{
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  value: string;

  @Prop({ type: String, required: false })
  icon?: string;

  @Prop({ type: String, required: false })
  color?: string;
}

@Schema({ _id: false, id: false, timestamps: false })
export class DatabasePropertySettings implements TDatabasePropertySettings {
  @Prop({ type: Number, default: 10 })
  width: number;

  @Prop({ type: [DatabasePropertySettingsOption], default: [] })
  options?: DatabasePropertySettingsOption[];

  @Prop({ type: String, required: false })
  dateFormat?: string;

  @Prop({ type: String, required: false })
  timeFormat?: string;

  @Prop({ type: String, required: false })
  timeZone?: string;

  @Prop({ type: String, required: false })
  numberFormat?: string;

  @Prop({ type: Boolean, required: false, default: false })
  hidden?: boolean;
}

@Schema({ _id: true, timestamps: true })
export class DatabaseProperty implements TDatabaseProperty {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, enum: EDatabasePropertyType, required: true })
  type: EDatabasePropertyType;

  @Prop({ type: DatabasePropertySettings, required: true })
  settings: DatabasePropertySettings;

  @Prop({ default: false })
  isDeleted?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

@Schema({ _id: false, timestamps: true })
export class DatabaseSortBy implements TDatabaseSortBy {
  @Prop({ type: String, required: true })
  propertyId: string;

  @Prop({ enum: ['asc', 'desc'], required: true })
  order: 'asc' | 'desc';
}

@Schema({ collection: 'databases', timestamps: true })
export class Database {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: () => [DatabaseProperty], required: true, minlength: 1 })
  properties: DatabaseProperty[];

  @Prop({ type: () => [DatabaseSortBy], default: [] })
  sortBy: DatabaseSortBy[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const DatabaseSchema = SchemaFactory.createForClass(Database);
DatabaseSchema.index({ id: 1 }, { unique: true });
DatabaseSchema.plugin(MongoosePaginate);
