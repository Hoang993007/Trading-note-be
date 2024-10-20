import { Injectable } from '@nestjs/common';
import { ClientSession, PaginateModel, UpdateWriteOpResult } from 'mongoose';
import { DatabaseDocument } from 'src/schemas/database.schema';
import { Database } from 'src/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { tradingNoteDatabase } from '../seedData/trading-note-database.seed';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Database.name)
    private readonly model: PaginateModel<DatabaseDocument>,
  ) {}

  async create(
    data: Partial<Database>,
    session: ClientSession,
  ): Promise<Database> {
    const res = await this.model.create([data], { session });
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

  async getAll(): Promise<Database[]> {
    return await this.model.find({}).lean();
  }

  async getAllNamesAndIds(): Promise<Pick<Database, 'id' | 'name'>[]> {
    return await this.model.find({}, { id: 1, name: 1, _id: 0 }).lean();
  }

  async getById(id: string): Promise<Database | null> {
    return await this.model.findOne({ id }).lean();
  }
}
