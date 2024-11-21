import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, PaginateModel, PaginateResult } from 'mongoose';
import { nanoid } from 'nanoid';
import {
  DatabaseData,
  DatabaseDataDocument,
} from 'src/schemas/database-data.schema';
import { NANOID_LENGTH } from 'src/shares/constants';
import { paginationToObject } from 'src/shares/helpers/mongoose/mongoose.helpers';
import { IPagination } from 'src/shares/shared.interface';
import { TDatabaseDataValue } from 'src/shares/types/database.type';

@Injectable()
export class DatabaseDataService {
  constructor(
    @InjectModel(DatabaseData.name)
    private readonly model: PaginateModel<DatabaseDataDocument>,
  ) {}

  // async updateAllData(session: ClientSession) {
  //   await this.model.updateMany(
  //     { isDeleted: false },
  //     { $set: { isDeleted: false } },
  //     { session },
  //   );
  // }

  // async castAllDateStringToTimestamp() {
  //   const dateCellPropertyId = 'Vzn9rTTVNSBf3FRfsOMWE';
  //   const databaseData = await this.model.find({
  //     values: { $elemMatch: { propertyId: dateCellPropertyId } },
  //   });
  //   for (const data of databaseData) {
  //     const dateValue = data.values.find(
  //       (v) => v.propertyId === dateCellPropertyId,
  //     )?.value;

  //     if (typeof dateValue === 'number') {
  //       continue;
  //     }

  //     const dataDate = new Date(dateValue as string);
  //     const dateToTimestamp = dataDate.getTime();

  //     if (!dateToTimestamp || isNaN(dateToTimestamp)) {
  //       continue;
  //     }

  //     await this.model.updateOne(
  //       { _id: data._id },
  //       { $set: { 'values.$[elem].value': dateToTimestamp } },
  //       { arrayFilters: [{ 'elem.propertyId': dateCellPropertyId }] },
  //     );
  //   }
  // }

  // async castDateUTCToNY() {
  //   const dateCellPropertyId = 'Vzn9rTTVNSBf3FRfsOMWE';
  //   const databaseData = await this.model.find({
  //     values: { $elemMatch: { propertyId: dateCellPropertyId } },
  //   });
  //   for (const data of databaseData) {
  //     const dateValue = data.values.find(
  //       (v) => v.propertyId === dateCellPropertyId,
  //     )?.value;
  //     await this.model.updateOne(
  //       { _id: data._id },
  //       {
  //         $set: {
  //           'values.$[elem].value': new Date(
  //             castDateUTCToNY(dateValue as string),
  //           ).getTime(),
  //         },
  //       },
  //       { arrayFilters: [{ 'elem.propertyId': dateCellPropertyId }] },
  //     );
  //   }
  // }

  // async castDateVNToUTC() {
  //   const dateCellPropertyId = 'Vzn9rTTVNSBf3FRfsOMWE';
  //   const databaseData = await this.model.find({
  //     values: { $elemMatch: { propertyId: dateCellPropertyId } },
  //   });
  //   const formatter = new Intl.DateTimeFormat('en-US', {
  //     timeZone: 'Asia/Ho_Chi_Minh',
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //   });

  //   for (const data of databaseData) {
  //     const dateValue = data.values.find(
  //       (v) => v.propertyId === dateCellPropertyId,
  //     )?.value;
  //     if (dateValue) {
  //       const dateParts = formatter
  //         .format(new Date(dateValue as string))
  //         .split('/');

  //       const dateUTC = new Date(
  //         Date.UTC(
  //           parseInt(dateParts[2]), // year
  //           parseInt(dateParts[0]) - 1, // month (0-based)
  //           parseInt(dateParts[1]), // day
  //           0,
  //           0,
  //           0,
  //           0,
  //         ),
  //       );
  //       await this.model.updateOne(
  //         { _id: data._id },
  //         {
  //           $set: {
  //             'values.$[elem].value': dateUTC.toISOString(),
  //           },
  //         },
  //         { arrayFilters: [{ 'elem.propertyId': dateCellPropertyId }] },
  //       );
  //     }
  //   }

  //   console.log('Done');
  // }

  async create(
    databaseId: string,
    data: TDatabaseDataValue[],
    session: ClientSession,
  ): Promise<DatabaseData> {
    const id = nanoid(NANOID_LENGTH);
    const newData = { databaseId, id, values: data, isDeleted: false };
    await this.model.create([newData], { session });
    return newData;
  }

  async getOfDatabase(
    databaseId: string,
    pagination: IPagination,
  ): Promise<PaginateResult<DatabaseData>> {
    const databaseData = await this.model.paginate(
      {
        databaseId,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      },
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
    console.log(`Update row ${dataId} of database ${databaseId}`);
    console.log('updatedData', updatedData);

    const databaseData = await this.model.findOne({
      databaseId,
      id: dataId,
    });

    const updateOperation = databaseData?.values.find(
      (v) => v.propertyId === updatedData.propertyId,
    )
      ? {
          $set: { 'values.$[property].value': updatedData.value },
        }
      : {
          $push: { values: updatedData },
        };

    const updatedDatabaseData = await this.model.findOneAndUpdate(
      {
        databaseId: databaseId,
        id: dataId,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      },
      updateOperation,
      {
        arrayFilters: [{ 'property.propertyId': updatedData.propertyId }],
        new: true,
        upsert: true,
        session,
      },
    );
    if (!updatedDatabaseData) {
      throw new NotFoundException('Database data not found');
    }
    return updatedDatabaseData.toObject();
  }

  async delete(
    databaseId: string,
    dataId: string,
    session: ClientSession,
  ): Promise<DatabaseData> {
    const updatedDatabase = await this.model.findOneAndUpdate(
      {
        databaseId,
        id: dataId,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!updatedDatabase) {
      throw new NotFoundException('Database data not found');
    }
    return updatedDatabase.toObject();
  }
}
