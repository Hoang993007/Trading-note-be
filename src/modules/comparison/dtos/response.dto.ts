import { Exclude, Expose } from 'class-transformer';
import { ComparisonItem } from 'src/schemas';
import { TComparison } from 'src/shares/types/comparison.type';

@Exclude()
export class ComparisonDto implements TComparison {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  items: ComparisonItem[];

  @Expose()
  isDeleted: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

@Exclude()
export class ComparisonMetadataDto
  implements Pick<TComparison, 'id' | 'name' | 'description'>
{
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  itemCount: number;
}
