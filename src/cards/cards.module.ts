import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card, CardSchema } from './schemas/card.schema';
import { Column } from 'typeorm';
import { ColumnSchema } from 'src/columns/schemas/column.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Column.name, schema: ColumnSchema },
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
