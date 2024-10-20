import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { DatabaseDto } from './database.dto';
import { TDatabaseDataValue } from 'src/shares/types/database.type';

@Exclude()
export class CreateDatabaseReqDto extends OmitType(DatabaseDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class AddNewRowBodyDto {
  row: TDatabaseDataValue[];
}
