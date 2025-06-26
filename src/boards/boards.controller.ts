import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.createBoard(createBoardDto);
  }

  @Get()
  findAll(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Get(':id/full')
  getFullBoard(@Param('id') id: string) {
    return this.boardsService.getFullBoard(id);
  }

  @Get()
  async getBoardsByUser(@Query('userId') userId: string) {
    const boards = await this.boardsService.getBoardsOfUser(userId);
    return boards;
  }

  @Delete(':id')
  async deleteBoard(@Param('id') id: string) {
    return this.boardsService.deleteBoard(id);
  }

  @Put(':id')
  async updateBoard(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, updateBoardDto);
  }

  @Patch(':id/update-column-order')
  updateColumnOrder(
    @Param('id') boardId: string,
    @Body('columnOrderIds') columnOrderIds: string[],
  ) {
    return this.boardsService.updateColumnOrder(boardId, columnOrderIds);
  }
}
