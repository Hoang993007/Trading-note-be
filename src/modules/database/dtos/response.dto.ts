import { Exclude, Expose, Type } from 'class-transformer';
import { DatabaseDto } from './database.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseData } from 'src/schemas';
import { ListResponseDto } from 'src/shares/dtos/base.dto';

@Exclude()
export class CreateDatabaseResDto extends DatabaseDto {}

@Exclude()
export class ListDatabaseDataResponseDto extends ListResponseDto<DatabaseData> {
  @Expose()
  @Type(() => DatabaseData)
  @ApiProperty({
    isArray: true,
    description: 'Array of documents',
    type: () => DatabaseData,
  })
  docs: DatabaseData[];
}
