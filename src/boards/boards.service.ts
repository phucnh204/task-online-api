import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { Column, ColumnDocument } from 'src/columns/schemas/column.schema';
import { Card, CardDocument } from 'src/cards/schemas/card.schema';

import { Model } from 'mongoose';
import { CreateBoardDto } from './dto/create-board.dto';

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
        options: { sort: { createdAt: 1 } },
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

  // Lấy danh sách board liên quan đến user
  async getBoardsOfUser(userId: string) {
    const boards = await this.boardModel.find({
      $or: [{ ownerIds: userId }, { memberIds: userId }],
    });

    return boards;
  }
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = new this.boardModel(createBoardDto);
    return board.save();
  }

  async deleteBoard(id: string): Promise<{ message: string }> {
    await this.boardModel.findByIdAndDelete(id);
    await this.columnModel.deleteMany({ boardId: id }); // xóa các cột liên quan

    return { message: 'Board deleted successfully' };
  }
}
