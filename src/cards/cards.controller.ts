import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './schemas/card.schema';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get(':columnId')
  getByColumn(@Param('columnId') columnId: string): Promise<Card[]> {
    return this.cardsService.getByColumnId(columnId);
  }
}
