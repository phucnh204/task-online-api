import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CardsService } from './cards.service';

import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Get('column/:columnId')
  getByColumn(@Param('columnId') columnId: string) {
    return this.cardsService.getByColumnId(columnId);
  }
}
