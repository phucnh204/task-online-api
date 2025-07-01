import { Types } from 'mongoose';

export class CreateBoardDto {
  title: string;
  description?: string;
  backgroundColor?: string;
  ownerIds: (string | Types.ObjectId)[];
  memberIds?: (string | Types.ObjectId)[];
}
