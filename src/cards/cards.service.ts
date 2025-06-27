import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './schemas/card.schema';
import { Model } from 'mongoose';
import { CreateCardDto } from './dto/create-card.dto';
import { Column } from 'typeorm';
import { ColumnDocument } from 'src/columns/schemas/column.schema';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(Column.name) private columnModel: Model<ColumnDocument>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const createdCard = await this.cardModel.create(createCardDto);

    // Update column.cardOrderIds
    await this.columnModel.findByIdAndUpdate(
      createCardDto.columnId,
      { $push: { cardOrderIds: createdCard._id } },
      { new: true },
    );

    return createdCard;
  }

  async getByColumnId(columnId: string) {
    return this.cardModel.find({ columnId }).exec();
  }
}
