import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Column } from 'src/columns/schemas/column.schema';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true })
export class Board {
  @Prop({ type: String })
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: [] })
  columnOrderIds: string[];

  @Prop({ default: [] })
  ownerIds: string[];

  @Prop({ default: [] })
  memberIds: string[];

  @Prop({ default: '#0079BF' })
  backgroundColor: string;

  // @Prop([{ type: String, ref: 'Column' }])
  // columns: string[];
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Column' })
  columns: Column[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
