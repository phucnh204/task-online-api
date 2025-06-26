import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Column, ColumnDocument } from './schemas/column.schema';
import mongoose, { Model } from 'mongoose';
import { CreateColumnDto } from './dto/create-column.dto';
import { Board, BoardDocument } from '../boards/schemas/board.schema';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name) private columnModel: Model<ColumnDocument>,
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    const { boardId, title } = createColumnDto;

    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board không tồn tại');

    const newColumn = (await this.columnModel.create({
      title,
      boardId,
    })) as ColumnDocument;

    board.columnOrderIds.push(
      (newColumn._id as mongoose.Types.ObjectId).toString(),
    );
    board.columns.push(newColumn as Column);
    await board.save();

    return newColumn;
  }

  async updateColumnTitle(columnId: string, newTitle: string): Promise<Column> {
    const column = await this.columnModel.findById(columnId);
    if (!column) {
      throw new NotFoundException('Column không tồn tại');
    }

    column.title = newTitle;
    await column.save();
    return column;
  }

  async deleteColumn(columnId: string): Promise<{ deleted: boolean }> {
    const column = await this.columnModel.findByIdAndDelete(columnId);

    if (!column) {
      throw new NotFoundException('Column not found');
    }
    await this.boardModel.findByIdAndUpdate(column.boardId, {
      $pull: { columnOrderIds: columnId },
    });
    return { deleted: true };
  }
}
