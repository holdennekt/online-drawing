import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type UserDocument = User & Document;
export type UserFromDB = User & Document & { _id: Types.ObjectId };

@Schema()
export class User {
  @Prop({ unique: true })
  name: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }] })
  pictures: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
