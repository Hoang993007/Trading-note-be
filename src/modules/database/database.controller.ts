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
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Connection } from 'mongoose';
import { nanoid } from 'nanoid';
import { Database, DatabaseData } from 'src/schemas';
import { NANOID_LENGTH } from 'src/shares/constants';
import { Pagination } from 'src/shares/decorators/api-pagination.decorator';
import { withTransaction } from 'src/shares/helpers/mongoose/transaction';
import { IPagination } from 'src/shares/shared.interface';
import {
  TDatabaseDataValue,
  TDatabasePropertySettings,
} from 'src/shares/types/database.type';
import {
  AddNewPropertyBodyDto,
  AddNewRowBodyDto,
  CreateDatabaseReqDto,
  UpdatePropertyBodyDto,
} from './dtos/request.dto';
import {
  CreateDatabaseResDto,
  ListDatabaseDataResponseDto,
} from './dtos/response.dto';
import { tradingNoteDatabase } from './seedData/trading-note-database.seed';
import { DatabaseService } from './services';
import { DatabaseDataService } from './services/database-data.service';
@ApiTags('Databases')
@Controller('databases')
export class DatabaseController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly databaseDataService: DatabaseDataService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post()
  @ApiOperation({
    operationId: 'createDatabase',
    summary: 'Create Database',
    description: 'Create Database',
  })
  @ApiBody({
    type: CreateDatabaseReqDto,
    examples: {
      default: {
        value: tradingNoteDatabase,
      },
    },
  })
  @ApiOkResponse({ description: 'Successful', type: CreateDatabaseResDto })
  async create(@Body() reqBody: CreateDatabaseReqDto) {
    return await withTransaction(this.connection, async (session) => {
      const res = await this.databaseService.create(reqBody, session);
      return plainToClass(CreateDatabaseResDto, res);
    });
  }

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

  @Put('update_seed')
  @ApiOperation({
    operationId: 'updateSeedTradingNoteDatabase',
    summary: 'Update Trading Note Database Seed',
    description: 'Update the existing Trading Note Database with new seed data',
  })
  @ApiOkResponse({ description: 'Successful' })
  async updateSeedTradingNoteDatabase() {
    return await this.databaseService.updateSeedDatabase();
  }

  // @Post('update_all_data')
  // @ApiOperation({
  //   operationId: 'updateAllData',
  //   summary: 'Update All Data',
  //   description: 'Update All Data',
  // })
  // @ApiOkResponse({ description: 'Successful' })
  // async updateAllData() {
  //   await withTransaction(this.connection, async (session) => {
  //     await this.databaseDataService.updateAllData(session);
  //   });
  // }

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

  @Post(':id/property')
  @ApiOperation({
    operationId: 'addNewProperty',
    summary: 'Add New Property',
    description: 'Add New Property',
  })
  @ApiOkResponse({ description: 'Successful', type: Database })
  async addNewProperty(
    @Param('id') id: string,
    @Body() body: AddNewPropertyBodyDto,
  ) {
    return await withTransaction(this.connection, async (session) => {
      return await this.databaseService.addNewProperty(id, body, session);
    });
  }

  @Put(':id/property/:propertyId')
  @ApiOperation({
    operationId: 'updateProperty',
    summary: 'Update Property',
    description: 'Update Property',
  })
  @ApiOkResponse({ description: 'Successful', type: Database })
  async updateProperty(
    @Param('id') id: string,
    @Param('propertyId') propertyId: string,
    @Body() body: UpdatePropertyBodyDto,
  ) {
    return await withTransaction(this.connection, async (session) => {
      return await this.databaseService.updateProperty(
        id,
        propertyId,
        body,
        session,
      );
    });
  }

  @Put(':id/property/:propertyId/settings')
  @ApiOperation({
    operationId: 'updatePropertySettings',
    summary: 'Update Property Settings',
    description: 'Update Property Settings',
  })
  @ApiOkResponse({ description: 'Successful', type: Database })
  async updatePropertySettings(
    @Param('id') id: string,
    @Param('propertyId') propertyId: string,
    @Body() body: TDatabasePropertySettings,
  ) {
    return await withTransaction(this.connection, async (session) => {
      return await this.databaseService.updatePropertySettings(
        id,
        propertyId,
        body,
        session,
      );
    });
  }

  @Delete(':id/property/:propertyId')
  @ApiOperation({
    operationId: 'deleteProperty',
    summary: 'Delete Property',
    description: 'Delete Property',
  })
  @ApiOkResponse({ description: 'Successful', type: Database })
  async deleteProperty(
    @Param('id') id: string,
    @Param('propertyId') propertyId: string,
  ) {
    return await withTransaction(this.connection, async (session) => {
      return await this.databaseService.deleteProperty(id, propertyId, session);
    });
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
