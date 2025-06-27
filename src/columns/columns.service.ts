import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Column, ColumnDocument } from './schemas/column.schema';
import mongoose, { Model } from 'mongoose';
import { CreateColumnDto } from './dto/create-column.dto';
import { Board, BoardDocument } from '../boards/schemas/board.schema';
import { Card, CardDocument } from 'src/cards/schemas/card.schema';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name) private columnModel: Model<ColumnDocument>,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const { boardId, title } = createColumnDto;

    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board không tồn tại');

    const newColumn = (await this.columnModel.create({
      title,
      boardId,
      cards: [], // Khởi tạo mảng cards rỗng
      cardOrderIds: [], // Khởi tạo mảng cardOrderIds rỗng
    })) as ColumnDocument;

    board.columnOrderIds.push(
      (newColumn._id as mongoose.Types.ObjectId).toString(),
    );
    board.columns.push(newColumn as Column);
    await board.save();

    const populatedColumn = await this.columnModel
      .findById(newColumn._id)
      .populate({ path: 'cards', model: 'Card' })
      .exec();

    if (!populatedColumn) {
      throw new NotFoundException('Column không tồn tại sau khi tạo');
    }

    return populatedColumn;
  }

  async updateColumnTitle(columnId: string, newTitle: string): Promise<Column> {
    const column = await this.columnModel
      .findByIdAndUpdate(columnId, { title: newTitle }, { new: true })
      .populate({
        path: 'cards',
        model: 'Card',
      })
      .exec();

    if (!column) {
      throw new NotFoundException('Column không tồn tại');
    }

    return column;
  }

  async deleteColumn(columnId: string): Promise<{ deleted: boolean }> {
    const column = await this.columnModel.findByIdAndDelete(columnId);

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    // Xóa tất cả cards trong column này
    await this.columnModel.updateOne(
      { _id: columnId },
      { $unset: { cards: 1, cardOrderIds: 1 } },
    );

    // Xóa column khỏi board
    await this.boardModel.findByIdAndUpdate(column.boardId, {
      $pull: {
        columnOrderIds: columnId,
        columns: columnId,
      },
    });

    return { deleted: true };
  }

  async findByBoardId(boardId: string): Promise<Column[]> {
    try {
      const columns = await this.columnModel
        .find({ boardId })
        .populate({
          path: 'cards',
          model: 'Card',
        })
        .exec();

      console.log('Columns found:', columns.length);
      console.log('First column cards:', columns[0]?.cards);

      return columns;
    } catch (error) {
      console.error('Error fetching columns:', error);
      throw error;
    }
  }

  // Thêm method để debug
  async getColumnWithCards(columnId: string): Promise<Column> {
    const column = await this.columnModel
      .findById(columnId)
      .populate({
        path: 'cards',
        model: 'Card',
      })
      .exec();

    if (!column) {
      throw new NotFoundException('Column không tồn tại');
    }

    console.log('Column cards:', column.cards);
    return column;
  }
}
