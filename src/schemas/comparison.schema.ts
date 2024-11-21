import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as MongoosePaginate from 'mongoose-paginate-v2';
import { TComparison, TComparisonItem } from 'src/shares/types/comparison.type';

export type ComparisonDocument = Comparison & Document;

@Schema({ _id: false, timestamps: true })
export class ComparisonItem implements TComparisonItem {
  @Prop({ type: String, required: true })
  databaseDataId: string;

  @Prop({ type: String, default: '' })
  comment: string;
}

@Schema({
  collection: 'comparison',
  timestamps: true,
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true },
})
export class Comparison implements TComparison {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: () => [ComparisonItem], default: [] })
  items: ComparisonItem[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  // itemCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ComparisonSchema = SchemaFactory.createForClass(Comparison);
// ComparisonSchema.virtual('itemCount').get(function (this: ComparisonDocument) {
//   return this.items?.length || 0;
// });
ComparisonSchema.index({ id: 1 }, { unique: true });
ComparisonSchema.plugin(MongoosePaginate);
