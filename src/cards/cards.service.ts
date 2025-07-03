import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './schemas/card.schema';
import { Model } from 'mongoose';
import { CreateCardDto } from './dto/create-card.dto';
import { Column, ColumnDocument } from '../columns/schemas/column.schema';
import { mapOrder } from 'src/utils/sort';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(Column.name) private columnModel: Model<ColumnDocument>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    // Tạo card mới
    const createdCard = await this.cardModel.create(createCardDto);

    // Cập nhật column: thêm card vào cả cardOrderIds và cards array
    await this.columnModel.findByIdAndUpdate(
      createCardDto.columnId,
      {
        $push: {
          cardOrderIds: createdCard._id.toString(),
          cards: createdCard._id,
        },
      },
      { new: true },
    );

    return createdCard;
  }

  async getByColumnId(columnId: string): Promise<Card[]> {
    return this.cardModel.find({ columnId }).exec();
  }

  async updateCard(cardId: string, updateData: Partial<Card>): Promise<Card> {
    const updatedCard = await this.cardModel
      .findByIdAndUpdate(cardId, updateData, { new: true })
      .exec();

    if (!updatedCard) {
      throw new NotFoundException('Card không tồn tại');
    }

    return updatedCard;
  }

  async deleteCard(cardId: string): Promise<void> {
    const card = await this.cardModel.findById(cardId);

    if (card) {
      // Xóa card khỏi column
      await this.columnModel.findByIdAndUpdate(card.columnId, {
        $pull: {
          cardOrderIds: cardId,
          cards: cardId,
        },
      });

      // Xóa card
      await this.cardModel.findByIdAndDelete(cardId);
    }
  }

  async moveCard(
    cardId: string,
    newColumnId: string,
    newPosition?: number,
  ): Promise<Card> {
    Logger.log(
      `moveCard called: ${cardId} -> ${newColumnId} at ${newPosition}`,
    );

    const card = await this.cardModel.findById(cardId);
    if (!card) throw new Error('Card not found');

    const oldColumnId = card.columnId;
    const isSameColumn = oldColumnId.toString() === newColumnId.toString();

    if (!isSameColumn) {
      await this.columnModel.findByIdAndUpdate(oldColumnId, {
        $pull: {
          cardOrderIds: cardId,
          cards: cardId,
        },
      });
    }

    const newColumn = await this.columnModel.findById(newColumnId);
    if (!newColumn) throw new Error('New column not found');

    let cardOrderIds = (newColumn.cardOrderIds as string[]).filter(
      (id) => id.toString() !== cardId,
    );
    let cards = (newColumn.cards as any[]).filter(
      (id) => id.toString() !== card._id.toString(),
    );

    const insertAt =
      typeof newPosition === 'number' ? newPosition : cardOrderIds.length;
    cardOrderIds.splice(insertAt, 0, cardId);
    cards.splice(insertAt, 0, card._id);

    await this.columnModel.findByIdAndUpdate(newColumnId, {
      $set: {
        cardOrderIds,
        cards,
      },
    });

    if (!isSameColumn) {
      card.columnId = newColumnId;
      await card.save();
    }

    Logger.log(
      `moveCard finished: ${cardId} -> ${newColumnId} at ${newPosition}`,
    );
    return card;
  }

  async getColumnById(columnId: string) {
    const column = await this.columnModel.findById(columnId).populate('cards');
    if (column) {
      column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
    }
    return column;
  }
}
