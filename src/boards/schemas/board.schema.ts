import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BoardDocument = Board & Document;

@Schema({ timestamps: true, _id: false })
export class Board {
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

  @Prop([{ type: String, ref: 'Column' }])
  columns: string[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
