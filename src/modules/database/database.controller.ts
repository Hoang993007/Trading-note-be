import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { plainToClass } from 'class-transformer';
import { Connection } from 'mongoose';
import { nanoid } from 'nanoid';
import { Database, DatabaseData } from 'src/schemas';
import { withTransaction } from 'src/shares/helpers/mongoose/transaction';
// import { CreateDatabaseReqDto } from './dtos/request.dto';
// import { CreateDatabaseResDto } from './dtos/response.dto';
// import { tradingNoteDatabase } from './seedData/trading-note-database.seed';
import { plainToClass, plainToInstance } from 'class-transformer';
import { NANOID_LENGTH } from 'src/shares/constants';
import { Pagination } from 'src/shares/decorators/api-pagination.decorator';
import { IPagination } from 'src/shares/shared.interface';
import { TDatabaseDataValue } from 'src/shares/types/database.type';
import { AddNewRowBodyDto } from './dtos/request.dto';
import { DatabaseService } from './services';
import { DatabaseDataService } from './services/database-data.service';
import { ListDatabaseDataResponseDto } from './dtos/response.dto';
@ApiTags('Databases')
@Controller('databases')
export class DatabaseController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly databaseDataService: DatabaseDataService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  // @Post()
  // @ApiOperation({
  //   operationId: 'createDatabase',
  //   summary: 'Create Database',
  //   description: 'Create Database',
  // })
  // @ApiBody({
  //   type: CreateDatabaseReqDto,
  //   examples: {
  //     default: {
  //       value: tradingNoteDatabase,
  //     },
  //   },
  // })
  // @ApiOkResponse({ description: 'Successful', type: CreateDatabaseResDto })
  // async create(@Body() reqBody: CreateDatabaseReqDto) {
  //   return await withTransaction(this.connection, async (session) => {
  //     const res = await this.databaseService.create(reqBody, session);
  //     return plainToClass(CreateDatabaseResDto, res);
  //   });
  // }

  @Get('generate_id_multiple')
  @ApiOperation({
    operationId: 'generateIdMultiple',
    summary: 'Generate Nanoid',
    description: 'Generate Nanoid',
  })
  @ApiOkResponse({ description: 'Successful', type: [String] })
  async generateIdMultiple() {
    return Array.from({ length: 10 }, () => nanoid(NANOID_LENGTH));
  }

  @Post('seed')
  @ApiOperation({
    operationId: 'seedTradingNoteDatabase',
    summary: 'Seed Trading Note Database',
    description: 'Seed the default Trading Note Database',
  })
  @ApiOkResponse({ description: 'Successful' })
  async seedTradingNoteDatabase() {
    await withTransaction(this.connection, async (session) => {
      await this.databaseService.seedOrUpdateDatabase(session);
    });
  }

  @Get('')
  @ApiOperation({
    operationId: 'getAllDatabase',
    summary: 'Get All Database',
    description: 'Get All Database',
  })
  @ApiOkResponse({ description: 'Successful', type: [Database] })
  async getAllDatabase() {
    return await this.databaseService.getAll();
  }

  @Get('names_and_ids')
  @ApiOperation({
    operationId: 'getAllDatabaseNamesAndIds',
    summary: 'Get All Database Names And Ids',
    description: 'Get All Database Names And Ids',
  })
  @ApiOkResponse({ description: 'Successful', type: [Database] })
  async getAllDatabaseNamesAndIds() {
    return await this.databaseService.getAllNamesAndIds();
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getDatabaseById',
    summary: 'Get Database By Id',
    description: 'Get Database By Id',
  })
  @ApiOkResponse({ description: 'Successful', type: Database })
  async getDatabaseById(@Param('id') id: string) {
    return plainToClass(Database, await this.databaseService.getById(id));
  }

  @Get(':id/data')
  @ApiOperation({
    operationId: 'getDatabaseDataById',
    summary: 'Get Database Data By Id',
    description: 'Get Database Data By Id',
  })
  @ApiOkResponse({
    description: 'Successful',
    type: ListDatabaseDataResponseDto,
  })
  async getDatabaseDataById(
    @Param('id') id: string,
    @Pagination() pagination: IPagination,
  ) {
    const res = await this.databaseDataService.getOfDatabase(id, pagination);
    return plainToInstance(ListDatabaseDataResponseDto, res);
  }

  @Post(':id/data')
  @ApiOperation({
    operationId: 'addNewRow',
    summary: 'Add New Row',
    description: 'Add New Row',
  })
  @ApiOkResponse({ description: 'Successful', type: DatabaseData })
  async addNewRow(@Param('id') id: string, @Body() body: AddNewRowBodyDto) {
    const res = await withTransaction(this.connection, async (session) => {
      return await this.databaseDataService.create(id, body.row, session);
    });
    return plainToInstance(DatabaseData, res);
  }

  @Put(':id/data/:dataId')
  @ApiOperation({
    operationId: 'updateRow',
    summary: 'Update Row',
    description: 'Update Row',
  })
  @ApiOkResponse({ description: 'Successful', type: DatabaseData })
  async updateRow(
    @Param('id') id: string,
    @Param('dataId') dataId: string,
    @Body() value: TDatabaseDataValue,
  ) {
    const res = await withTransaction(this.connection, async (session) => {
      return await this.databaseDataService.update(id, dataId, value, session);
    });
    return plainToInstance(DatabaseData, res);
  }

  @Delete(':id/data/:dataId')
  @ApiOperation({
    operationId: 'deleteRow',
    summary: 'Delete Row',
    description: 'Delete Row',
  })
  @ApiOkResponse({ description: 'Successful', type: DatabaseData })
  async deleteRow(@Param('id') id: string, @Param('dataId') dataId: string) {
    const res = await withTransaction(this.connection, async (session) => {
      return await this.databaseDataService.delete(id, dataId, session);
    });
    return plainToInstance(DatabaseData, res);
  }
}
