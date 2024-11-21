import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  EDatabasePropertyType,
  TDatabaseDataValue,
  TDatabaseDataValueValue,
  TDatabaseProperty,
} from 'src/shares/types/database.type';
import { DatabaseDto, DatabasePropertySettingsDto } from './database.dto';

@Exclude()
export class CreateDatabaseReqDto extends OmitType(DatabaseDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

@Exclude()
export class DatabaseDataValueDto implements TDatabaseDataValue {
  @Expose()
  @ApiProperty({
    description: 'Property ID of the database data',
    example: '123',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Value of the database data',
    example: 'Hello',
    type: 'string',
  })
  @IsOptional()
  value: TDatabaseDataValueValue;
}

@Exclude()
export class AddNewRowBodyDto {
  @Expose()
  @ApiProperty({
    description: 'Array of database data values',
    type: [DatabaseDataValueDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DatabaseDataValueDto)
  row: DatabaseDataValueDto[];
}

@Exclude()
export class AddNewPropertyBodyDto
  implements Pick<TDatabaseProperty, 'name' | 'type' | 'settings'>
{
  @Expose()
  @ApiProperty({
    description: 'Name of the property',
    example: 'Hello',
    type: 'string',
    required: true,
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Type of the property',
    example: 'string',
    type: 'string',
    required: true,
  })
  @IsEnum(EDatabasePropertyType)
  type: EDatabasePropertyType;

  @Expose()
  @ApiProperty({
    description: 'Settings of the property',
    type: DatabasePropertySettingsDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => DatabasePropertySettingsDto)
  settings: DatabasePropertySettingsDto;
}

@Exclude()
export class UpdatePropertyBodyDto {
  @Expose()
  @ApiProperty({
    description: 'Name of the property',
    example: 'Hello',
    type: 'string',
    required: true,
  })
  name: string;
}
