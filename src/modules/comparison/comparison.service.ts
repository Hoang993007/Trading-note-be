import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, PaginateModel } from 'mongoose';
import { nanoid } from 'nanoid';
import { Comparison, ComparisonDocument } from 'src/schemas';
import { NANOID_LENGTH } from 'src/shares/constants';
import { CreateComparisonBodyDto } from './dtos/request.dto';

@Injectable()
export class ComparisonService {
  constructor(
    @InjectModel(Comparison.name)
    private readonly model: PaginateModel<ComparisonDocument>,
  ) {}

  async create(
    data: CreateComparisonBodyDto,
    session: ClientSession,
  ): Promise<Comparison> {
    const res = await this.model.create(
      [{ ...data, id: nanoid(NANOID_LENGTH) }],
      { session },
    );
    return res[0].toObject();
  }

  async addItem(
    comparisonId: string,
    databaseDataIds: string[],
    session: ClientSession,
  ): Promise<Comparison> {
    return await this.model.findOneAndUpdate(
      { id: comparisonId },
      {
        $push: {
          items: {
            $each: databaseDataIds.map((id) => ({
              databaseDataId: id,
              comment: '',
            })),
          },
        },
      },
      { new: true, session },
    );
  }

  async commentItem(
    comparisonId: string,
    itemId: string,
    comment: string,
    session: ClientSession,
  ): Promise<Comparison> {
    return await this.model.findOneAndUpdate(
      { id: comparisonId },
      { $set: { 'items.$[item].comment': comment } },
      { new: true, session, arrayFilters: [{ 'item.databaseDataId': itemId }] },
    );
  }

  async deleteItem(
    comparisonId: string,
    itemId: string,
    session: ClientSession,
  ): Promise<Comparison> {
    return await this.model.findOneAndUpdate(
      { id: comparisonId, 'items.databaseDataId': itemId },
      { $pull: { items: { databaseDataId: itemId } } },
      { new: true, session },
    );
  }

  async getAllMetadata(): Promise<
    (Pick<Comparison, 'id' | 'name' | 'description'> & {
      itemCount: number;
    })[]
  > {
    return await this.model.aggregate([
      {
        $match: {
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      },
      {
        $addFields: {
          itemCount: { $size: '$items' },
        },
      },
      {
        $project: { id: 1, name: 1, description: 1, _id: 0, itemCount: 1 },
      },
    ]);
  }

  async getById(id: string): Promise<Comparison | null> {
    return await this.model.findOne({ id, isDeleted: false }).lean();
  }

  async delete(
    comparisonId: string,
    session: ClientSession,
  ): Promise<Comparison | null> {
    return await this.model.findOneAndUpdate(
      { id: comparisonId },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
  }
}
