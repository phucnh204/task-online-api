import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from './schemas/board.schema';
import { Column, ColumnDocument } from 'src/columns/schemas/column.schema';
import { Card, CardDocument } from 'src/cards/schemas/card.schema';

import { Model, Types } from 'mongoose';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

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

  async getFullBoard(boardId: string, userId: string) {
    const board = await this.boardModel
      .findById(boardId)
      .populate({
        path: 'columns',
        model: 'Column',
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

    // Kiểm tra quyền truy cập
    const userObjectId = new Types.ObjectId(userId);

    if (
      !board.ownerIds.some((id) => id.equals(userObjectId)) &&
      !board.memberIds.some((id) => id.equals(userObjectId))
    ) {
      throw new ForbiddenException('Bạn không có quyền truy cập board này');
    }

    return { board };
  }

  // Lấy danh sách board liên quan đến user
  async getBoardsOfUser(userId: string) {
    const objectUserId = new Types.ObjectId(userId);
    return this.boardModel.find({
      $or: [{ ownerIds: objectUserId }, { memberIds: objectUserId }],
    });
  }
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    createBoardDto.ownerIds = createBoardDto.ownerIds.map(
      (id) => new Types.ObjectId(id),
    );

    createBoardDto.memberIds = (createBoardDto.memberIds || []).map(
      (id) => new Types.ObjectId(id),
    );

    const board = new this.boardModel(createBoardDto);
    return board.save();
  }

  async deleteBoard(id: string): Promise<{ message: string }> {
    await this.boardModel.findByIdAndDelete(id);
    await this.columnModel.deleteMany({ boardId: id }); // xóa các cột liên quan

    return { message: 'Board deleted successfully' };
  }

  async updateBoard(
    id: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const updatedBoard = await this.boardModel.findByIdAndUpdate(
      id,
      updateBoardDto,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedBoard) {
      throw new NotFoundException(`Board với id ${id} không tồn tại`);
    }

    return updatedBoard;
  }

  async updateColumnOrder(boardId: string, columnOrderIds: string[]) {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board không tồn tại');

    board.columnOrderIds = columnOrderIds;
    await board.save();
    return board;
  }
}
