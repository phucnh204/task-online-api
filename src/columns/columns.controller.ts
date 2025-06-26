// src/columns/columns.controller.ts
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { Column } from './schemas/column.schema';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  async create(@Body() dto: CreateColumnDto): Promise<Column> {
    return this.columnsService.create(dto);
  }

  @Patch(':id')
  async updateColumn(
    @Param('id') columnId: string,
    @Body() body: { title: string },
  ): Promise<Column> {
    return this.columnsService.updateColumnTitle(columnId, body.title);
  }

  @Delete(':id')
  async deleteColumn(@Param('id') id: string) {
    return this.columnsService.deleteColumn(id);
  }
}
