import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsString } from 'class-validator';
import {
  Database,
  DatabaseProperty,
  DatabasePropertySettings,
  DatabasePropertySettingsOption,
  DatabaseSortBy,
} from 'src/schemas';
import { EDatabasePropertyType } from 'src/shares/types/database.type';

@Exclude()
export class DatabasePropertySettingsOptionDto
  implements DatabasePropertySettingsOption
{
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  name: string;

  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  value: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  icon?: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  color?: string;
}

@Exclude()
export class DatabasePropertySettingsDto implements DatabasePropertySettings {
  @Expose()
  @ApiPropertyOptional({
    type: [DatabasePropertySettingsOptionDto],
    required: false,
  })
  @IsArray()
  options: DatabasePropertySettingsOptionDto[];

  @Expose()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  @IsString()
  dateFormat: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  @IsString()
  timeFormat: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  @IsString()
  timeZone: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    required: false,
  })
  @IsString()
  numberFormat: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    required: true,
    example: false,
  })
  @IsBoolean()
  hidden: boolean;
}

@Exclude()
export class DatabasePropertyDto implements DatabaseProperty {
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  id: string;

  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  name: string;

  @Expose()
  @ApiProperty({
    enum: EDatabasePropertyType,
    default: EDatabasePropertyType.TEXT,
    required: true,
  })
  @IsEnum(EDatabasePropertyType)
  type: EDatabasePropertyType;

  @Expose()
  @ApiProperty({
    type: DatabasePropertySettingsDto,
    required: true,
  })
  settings: DatabasePropertySettingsDto;

  @Expose()
  @ApiProperty({
    type: Date,
    required: true,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    type: Date,
    required: true,
  })
  updatedAt: Date;
}

@Exclude()
export class DatabaseSortByDto implements DatabaseSortBy {
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  propertyId: string;

  @Expose()
  @ApiProperty({
    enum: ['asc', 'desc'],
    required: true,
  })
  @IsEnum(['asc', 'desc'])
  order: 'asc' | 'desc';
}

@Exclude()
export class DatabaseDto implements Database {
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    type: [DatabasePropertyDto],
    required: true,
  })
  @IsArray()
  properties: DatabasePropertyDto[];

  @Expose()
  @ApiProperty({
    type: [DatabaseSortByDto],
    required: true,
  })
  @IsArray()
  sortBy: DatabaseSortByDto[];

  @Expose()
  @ApiProperty({
    type: Date,
    required: true,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    type: Date,
    required: true,
  })
  updatedAt: Date;
}
