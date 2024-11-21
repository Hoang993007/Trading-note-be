import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Connection } from 'mongoose';
import { withTransaction } from 'src/shares/helpers/mongoose/transaction';
import { ComparisonService } from './comparison.service';
import {
  AddItemsToComparisonBodyDto,
  CommentItemBodyDto,
  CreateComparisonBodyDto,
} from './dtos/request.dto';
import { ComparisonDto, ComparisonMetadataDto } from './dtos/response.dto';

@ApiTags('Comparisons')
@Controller('comparisons')
export class ComparisonController {
  constructor(
    private readonly comparisonService: ComparisonService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Post()
  @ApiOperation({
    operationId: 'createComparison',
    summary: 'Create Comparison',
    description: 'Create Comparison',
  })
  @ApiOkResponse({ description: 'Successful', type: ComparisonDto })
  async create(@Body() body: CreateComparisonBodyDto) {
    return await withTransaction(this.connection, async (session) => {
      return await this.comparisonService.create(body, session);
    });
  }

  @Post(':id/items')
  @ApiOperation({
    operationId: 'addItemsToComparison',
    summary: 'Add Items To Comparison',
    description: 'Add Items To Comparison',
  })
  async addItemsToComparison(
    @Param('id') id: string,
    @Body() body: AddItemsToComparisonBodyDto,
  ) {
    return await withTransaction(this.connection, async (session) => {
      return await this.comparisonService.addItem(
        id,
        body.databaseDataIds,
        session,
      );
    });
  }

  @Delete(':id/items/:itemId')
  async deleteItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return await withTransaction(this.connection, async (session) => {
      return await this.comparisonService.deleteItem(id, itemId, session);
    });
  }

  @Post(':id/items/:itemId/comment')
  async commentItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() body: CommentItemBodyDto,
  ) {
    return await withTransaction(this.connection, async (session) => {
      return await this.comparisonService.commentItem(
        id,
        itemId,
        body.comment,
        session,
      );
    });
  }

  @Get('metadata')
  @ApiOperation({
    operationId: 'getAllComparisonMetadata',
    summary: 'Get All Comparison Metadata',
    description: 'Get All Comparison Metadata',
  })
  @ApiOkResponse({
    description: 'Successful',
    type: [ComparisonMetadataDto],
  })
  async getAllComparisonMetadata() {
    return plainToInstance(
      ComparisonMetadataDto,
      await this.comparisonService.getAllMetadata(),
    );
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getComparisonById',
    summary: 'Get Comparison By Id',
    description: 'Get Comparison By Id',
  })
  @ApiOkResponse({ description: 'Successful', type: ComparisonDto })
  async getComparisonById(@Param('id') id: string) {
    return plainToClass(
      ComparisonDto,
      await this.comparisonService.getById(id),
    );
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteComparison',
    summary: 'Delete Comparison',
    description: 'Delete Comparison',
  })
  @ApiOkResponse({ description: 'Successful', type: ComparisonDto })
  async deleteComparison(@Param('id') id: string) {
    return await withTransaction(this.connection, async (session) => {
      return await this.comparisonService.delete(id, session);
    });
  }
}
