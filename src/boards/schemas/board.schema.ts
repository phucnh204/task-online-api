import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

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

  @Prop({ default: '#0079BF' }) // Màu mặc định nếu frontend không gửi
  backgroundColor: string;

  // @Prop([{ type: String, ref: 'Column' }])
  // columns: string[];
  @Prop({ type: [Types.ObjectId], ref: 'Column', default: [] })
  columns: Types.ObjectId[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
