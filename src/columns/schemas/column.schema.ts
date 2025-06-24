import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ColumnDocument = Column & Document;

@Schema({ timestamps: true, _id: false })
export class Column {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  boardId: string;

  @Prop({ type: [String], default: [] })
  cardOrderIds: string[];

  @Prop([{ type: String, ref: 'Card' }])
  cards: string[];
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
