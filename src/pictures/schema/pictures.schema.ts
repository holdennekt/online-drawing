import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type PictureDocument = Picture & Document;
export type PictureFromDB = Document & Picture & { _id: Types.ObjectId };

@Schema()
export class Picture {
  @Prop()
  name: string;

  @Prop()
  canvas: string;

  @Prop()
  accessMode: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
