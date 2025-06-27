import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './schemas/card.schema';
import { Model } from 'mongoose';
import { CreateCardDto } from './dto/create-card.dto';
import { Column, ColumnDocument } from '../columns/schemas/column.schema';

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
    const card = await this.cardModel.findById(cardId);
    if (!card) throw new Error('Card not found');

    const oldColumnId = card.columnId;

    // 1. Xóa card khỏi column cũ (cardOrderIds và cards)
    await this.columnModel.findByIdAndUpdate(oldColumnId, {
      $pull: {
        cardOrderIds: cardId,
        cards: cardId,
      },
    });

    // 2. Thêm card vào column mới (đúng vị trí)
    const updateOperation =
      newPosition !== undefined
        ? {
            $push: {
              cardOrderIds: { $each: [cardId], $position: newPosition },
              cards: { $each: [card._id], $position: newPosition },
            },
          }
        : {
            $push: {
              cardOrderIds: cardId,
              cards: card._id,
            },
          };

    await this.columnModel.findByIdAndUpdate(newColumnId, updateOperation);

    // 3. Cập nhật columnId của card
    card.columnId = newColumnId;
    await card.save();

    return card;
  }
}
