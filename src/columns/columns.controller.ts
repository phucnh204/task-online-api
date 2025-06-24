import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { Column } from './schemas/column.schema';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  // Tạo column mới
  @Post()
  async create(@Body() createColumnDto: CreateColumnDto): Promise<Column> {
    return this.columnsService.create(createColumnDto);
  }

  // Lấy toàn bộ column (tùy bạn dùng hay không)
  @Get()
  async findAll(): Promise<Column[]> {
    return this.columnsService.findAll();
  }

  // Lấy column theo id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Column> {
    return this.columnsService.findOne(id);
  }

  // Xoá column
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.columnsService.delete(id);
  }

  // Cập nhật column (đổi tên, cardOrderIds, ...)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Column>,
  ): Promise<Column> {
    return this.columnsService.update(id, data);
  }

  // Lấy tất cả column của 1 board cụ thể
  @Get('board/:boardId')
  async findByBoardId(@Param('boardId') boardId: string): Promise<Column[]> {
    return this.columnsService.findByBoardId(boardId);
  }
}
