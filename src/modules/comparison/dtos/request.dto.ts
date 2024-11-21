import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CreateComparisonBodyDto {
  @Expose()
  @ApiProperty({
    description: 'The name of the comparison',
    example: 'My Comparison',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    description: 'The description of the comparison',
    example: 'My Comparison Description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}

@Exclude()
export class AddItemsToComparisonBodyDto {
  @Expose()
  @IsArray()
  @IsString({ each: true })
  databaseDataIds: string[];
}

@Exclude()
export class CommentItemBodyDto {
  @Expose()
  @IsString()
  comment: string;
}
