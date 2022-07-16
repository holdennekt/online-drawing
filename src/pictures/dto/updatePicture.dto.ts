import { ObjectId } from 'mongoose';

export class UpdatePictureDto {
  readonly _id: ObjectId;
  readonly name: string;
  readonly canvas: string;
  readonly accessMode: string;
}
