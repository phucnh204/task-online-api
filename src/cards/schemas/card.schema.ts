import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ timestamps: true, _id: false })
export class Card {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  boardId: string;

  @Prop({ required: true })
  columnId: string;

  @Prop()
  description: string;

  @Prop()
  cover: string;

  @Prop({ type: [String], default: [] })
  memberIds: string[];

  @Prop({ type: [String], default: [] })
  comments: string[];

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  dueDate: string;

  _id?: Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
