import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, PaginateModel, UpdateWriteOpResult } from 'mongoose';
import { nanoid } from 'nanoid';
import { Database } from 'src/schemas';
import {
  DatabaseDocument,
  DatabaseProperty,
  DatabasePropertySettings,
} from 'src/schemas/database.schema';
import { NANOID_LENGTH } from 'src/shares/constants';
import { TDatabasePropertySettings } from 'src/shares/types';
import {
  AddNewPropertyBodyDto,
  UpdatePropertyBodyDto,
} from '../dtos/request.dto';
import { tradingNoteDatabase } from '../seedData/trading-note-database.seed';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Database.name)
    private readonly model: PaginateModel<DatabaseDocument>,
  ) {}

  async create(
    data: Omit<Database, 'id' | 'createdAt' | 'updatedAt'>,
    session: ClientSession,
  ): Promise<Database> {
    const res = await this.model.create(
      [
        {
          id: nanoid(NANOID_LENGTH),
          name: data.name,
          properties: data.properties,
          sortBy: data.sortBy,
        },
      ],
      { session },
    );
    return res[0].toObject();
  }

  async seedOrUpdateDatabase(
    session: ClientSession,
  ): Promise<UpdateWriteOpResult> {
    const updatedDatabase = await this.model.updateOne(
      { id: tradingNoteDatabase.id },
      { $set: tradingNoteDatabase },
      { new: true, session, upsert: true },
    );
    return updatedDatabase;
  }

  async updateSeedDatabase(): Promise<any> {
    const currentDatabase = await this.model
      .findOne({ id: tradingNoteDatabase.id })
      .lean();
    if (!currentDatabase) {
      console.log('No database found to update seed');
      return;
    }

    return currentDatabase;
  }

  async getAll(): Promise<Database[]> {
    return await this.model
      .find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] })
      .lean();
  }

  async getAllNamesAndIds(): Promise<Pick<Database, 'id' | 'name'>[]> {
    return await this.model
      .find(
        {
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
        { id: 1, name: 1, _id: 0 },
      )
      .lean();
  }

  async getById(id: string): Promise<Database | null> {
    return await this.model.findOne({ id, isDeleted: false }).lean();
  }

  async getPropertyById(
    databaseId: string,
    propertyId: string,
  ): Promise<DatabaseProperty | null> {
    const database = await this.getById(databaseId);
    return database?.properties.find((p) => p.id === propertyId) || null;
  }

  async addNewProperty(
    databaseId: string,
    property: AddNewPropertyBodyDto,
    session: ClientSession,
  ): Promise<Database | null> {
    console.log(`Add new property for database ${databaseId}`, property);
    return await this.model.findOneAndUpdate(
      { id: databaseId },
      {
        $push: {
          properties: {
            id: nanoid(NANOID_LENGTH),
            name: property.name,
            type: property.type,
            settings: property.settings,
          },
        },
      },
      { new: true, upsert: true, session },
    );
  }

  async deleteProperty(
    databaseId: string,
    propertyId: string,
    session: ClientSession,
  ): Promise<Database | null> {
    return await this.model.findOneAndUpdate(
      { id: databaseId },
      { $set: { 'properties.$[property].isDeleted': true } },
      {
        arrayFilters: [{ 'property.id': propertyId }],
        new: true,
        session,
      },
    );
  }

  validatePropertySettings = (
    settings: any,
  ): settings is DatabasePropertySettings => {
    if (typeof settings !== 'object' || settings === null) {
      throw new Error('Settings must be a non-null object');
    }

    // Validate options array
    if (
      settings.options !== undefined &&
      settings.options !== null &&
      (!Array.isArray(settings.options) ||
        !settings.options.every(
          (option: any) =>
            typeof option === 'object' &&
            option !== null &&
            typeof option.name === 'string' &&
            typeof option.value === 'string' &&
            (option.icon === undefined || typeof option.icon === 'string') &&
            (option.color === undefined || typeof option.color === 'string'),
        ))
    ) {
      throw new Error('Invalid options format');
    }

    // Validate date and time settings
    if (
      settings.dateFormat !== undefined &&
      settings.dateFormat !== null &&
      typeof settings.dateFormat !== 'string'
    ) {
      throw new Error('Invalid dateFormat');
    }
    if (
      settings.timeFormat !== undefined &&
      settings.timeFormat !== null &&
      typeof settings.timeFormat !== 'string'
    ) {
      throw new Error('Invalid timeFormat');
    }
    if (
      settings.timeZone !== undefined &&
      settings.timeZone !== null &&
      typeof settings.timeZone !== 'string'
    ) {
      throw new Error('Invalid timeZone');
    }

    // Validate number settings
    if (
      settings.numberFormat !== undefined &&
      settings.numberFormat !== null &&
      typeof settings.numberFormat !== 'string'
    ) {
      throw new Error('Invalid numberFormat');
    }

    // Validate visibility setting
    if (
      settings.hidden !== undefined &&
      settings.hidden !== null &&
      typeof settings.hidden !== 'boolean'
    ) {
      throw new Error('Invalid hidden setting');
    }

    // Validate relation settings
    if (
      settings.relationTargetDatabaseId !== undefined &&
      settings.relationTargetDatabaseId !== null &&
      typeof settings.relationTargetDatabaseId !== 'string'
    ) {
      throw new Error('Invalid relationTargetDatabaseId');
    }
    if (
      settings.relationTargetPropertyId !== undefined &&
      typeof settings.relationTargetPropertyId !== 'string'
    ) {
      throw new Error('Invalid relationTargetPropertyId');
    }

    return true;
  };

  async updateProperty(
    databaseId: string,
    propertyId: string,
    updatedProperty: UpdatePropertyBodyDto,
    session: ClientSession,
  ): Promise<Database | null> {
    console.log(
      `Update property ${propertyId} for database ${databaseId}`,
      updatedProperty,
    );
    return await this.model.findOneAndUpdate(
      { id: databaseId },
      { $set: { 'properties.$[property].name': updatedProperty.name } },
      { arrayFilters: [{ 'property.id': propertyId }], new: true, session },
    );
  }

  async updatePropertySettings(
    databaseId: string,
    propertyId: string,
    updatedSettings: TDatabasePropertySettings,
    session: ClientSession,
  ): Promise<Database | null> {
    this.validatePropertySettings(updatedSettings);

    const updateResult = await this.model.findOneAndUpdate(
      { id: databaseId },
      { $set: { 'properties.$[property].settings': updatedSettings } },
      {
        arrayFilters: [{ 'property.id': propertyId }],
        new: true,
        session,
      },
    );

    return updateResult;
  }
}
