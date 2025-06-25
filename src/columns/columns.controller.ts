// src/columns/columns.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
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
}
