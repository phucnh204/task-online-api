import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    return await this.cardsService.create(createCardDto);
  }

  @Get('column/:columnId')
  async getByColumn(@Param('columnId') columnId: string) {
    return await this.cardsService.getByColumnId(columnId);
  }

  @Put(':id')
  async updateCard(@Param('id') cardId: string, @Body() updateData: any) {
    return await this.cardsService.updateCard(cardId, updateData);
  }

  @Delete(':id')
  async deleteCard(@Param('id') cardId: string) {
    await this.cardsService.deleteCard(cardId);
    return { deleted: true };
  }

  @Put(':id/move')
  async moveCard(
    @Param('id') cardId: string,
    @Body() moveData: { newColumnId: string; newPosition?: number },
  ) {
    return await this.cardsService.moveCard(
      cardId,
      moveData.newColumnId,
      moveData.newPosition,
    );
  }
}
