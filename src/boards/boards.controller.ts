import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @Get()
  findAll(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Get(':id/full')
  getFullBoard(@Param('id') id: string) {
    return this.boardsService.getFullBoard(id);
  }
}
