import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { Column, ColumnDocument } from 'src/columns/schemas/column.schema';
import { Card, CardDocument } from 'src/cards/schemas/card.schema';

import { Model } from 'mongoose';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(Column.name) private columnModel: Model<ColumnDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
  ) {}

  async create(data: Partial<Board>): Promise<Board> {
    return this.boardModel.create(data);
  }

  async findAll(): Promise<Board[]> {
    return this.boardModel.find();
  }

  async getFullBoard(boardId: string) {
    const board = await this.boardModel
      .findById(boardId)
      .populate({
        path: 'columns',
        options: { sort: { createdAt: 1 } }, // nếu cần sắp xếp
        populate: {
          path: 'cards',
          model: 'Card',
          options: { sort: { createdAt: 1 } },
        },
      })
      .exec();

    if (!board) {
      throw new NotFoundException('Board không tồn tại');
    }

    return { board };
  }
}
