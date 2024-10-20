import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, PaginateModel, PaginateResult } from 'mongoose';
import { nanoid } from 'nanoid';
import {
  DatabaseData,
  DatabaseDataDocument,
} from 'src/schemas/database-data.schema';
import { Database } from 'src/schemas/database.schema';
import { NANOID_LENGTH } from 'src/shares/constants';
import { paginationToObject } from 'src/shares/helpers/mongoose/mongoose.helpers';
import { IPagination } from 'src/shares/shared.interface';
import {
  TDatabaseData,
  TDatabaseDataValue,
} from 'src/shares/types/database.type';

@Injectable()
export class DatabaseDataService {
  constructor(
    @InjectModel(DatabaseData.name)
    private readonly model: PaginateModel<DatabaseDataDocument>,
  ) {}

  async create(
    databaseId: string,
    data: TDatabaseDataValue[],
    session: ClientSession,
  ): Promise<DatabaseData> {
    const id = nanoid(NANOID_LENGTH);
    const newData = { databaseId, id, values: data };
    await this.model.create([newData], { session });
    return newData;
  }

  async getOfDatabase(
    databaseId: string,
    pagination: IPagination,
  ): Promise<PaginateResult<DatabaseData>> {
    const databaseData = await this.model.paginate(
      { databaseId },
      { ...pagination },
    );
    return paginationToObject(databaseData);
  }

  async update(
    databaseId: string,
    dataId: string,
    updatedData: TDatabaseDataValue,
    session: ClientSession,
  ): Promise<DatabaseData> {
    // console.log(`Update row ${dataId} of database ${databaseId}`);
    // console.log('updatedData', updatedData);

    const updatedDatabaseData = await this.model.findOneAndUpdate(
      { databaseId: databaseId, id: dataId },
      { $set: { 'values.$[property].value': updatedData.value } },
      {
        arrayFilters: [{ 'property.propertyId': updatedData.propertyId }],
        new: true,
        upsert: true,
        session,
      },
    );
    return updatedDatabaseData.toObject();
  }

  async delete(
    databaseId: string,
    dataId: string,
    session: ClientSession,
  ): Promise<Database> {
    const updatedDatabase = await this.model.findOneAndUpdate(
      { id: databaseId },
      { $pull: { data: { id: dataId } } },
      { new: true, session },
    );
    return updatedDatabase.toObject();
  }
}
