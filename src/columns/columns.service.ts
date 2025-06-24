import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Column, ColumnDocument } from './schemas/column.schema';
import { Model } from 'mongoose';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name) private columnModel: Model<ColumnDocument>,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    return this.columnModel.create(createColumnDto);
  }

  // Lấy tất cả columns
  async findAll(): Promise<Column[]> {
    return this.columnModel.find();
  }

  // Lấy column theo ID
  async findOne(id: string): Promise<Column> {
    const column = await this.columnModel.findById(id);
    if (!column) throw new NotFoundException('Column not found');
    return column;
  }

  // Xóa column
  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.columnModel.deleteOne({ _id: id });
    return { deleted: result.deletedCount > 0 };
  }

  // (Tuỳ chọn) Cập nhật column (ví dụ: đổi tên, cập nhật cardOrderIds)
  async update(id: string, data: Partial<Column>): Promise<Column> {
    const column = await this.columnModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!column) throw new NotFoundException('Column not found');
    return column;
  }

  // (Tuỳ chọn) Lấy các column theo boardId
  async findByBoardId(boardId: string): Promise<Column[]> {
    return this.columnModel.find({ boardId });
  }
}
