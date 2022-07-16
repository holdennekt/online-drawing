import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { UserFromDB } from 'src/users/schema/user.schema';
import { CreatePictureDto } from './dto/createPicture.dto';
import { UpdatePictureDto } from './dto/updatePicture.dto';
import {
  Picture,
  PictureDocument,
  PictureFromDB,
} from './schema/pictures.schema';

@Injectable()
export class PicturesService {
  constructor(
    @InjectModel(Picture.name)
    private readonly pictureModel: Model<PictureDocument>,
  ) {}

  async getAllForUser(user: UserFromDB): Promise<PictureFromDB[]> {
    const pictures: PictureFromDB[] = [];
    for (const pictureId of user.pictures) {
      const picture = await this.pictureModel.findById(pictureId).exec();
      pictures.push(picture);
    }
    return pictures;
  }

  async getOneForUser(
    user: UserFromDB,
    pictureId: ObjectId,
  ): Promise<PictureFromDB> {
    const pictures = await this.getAllForUser(user);
    if (!pictures.some((pic) => pic._id === pictureId)) {
      throw new UnauthorizedException('no picture with such id');
    }
    return await this.getById(pictureId);
  }

  async getById(id: ObjectId): Promise<PictureFromDB> {
    return this.pictureModel.findById(id).exec();
  }

  async create(
    user: UserFromDB,
    dto: CreatePictureDto,
  ): Promise<PictureFromDB> {
    const picture = await this.pictureModel.create({
      ...dto,
      userId: user._id,
      accessMode: 'limited',
    });
    user.pictures.push(picture._id);
    await user.save();
    return picture;
  }

  async deleteOneForUser(
    user: UserFromDB,
    pictureId: ObjectId,
  ): Promise<PictureFromDB> {
    if (!user.pictures.some((picId) => picId === pictureId)) {
      throw new UnauthorizedException('no picture with such id');
    }
    user.pictures = user.pictures.filter((picId) => picId !== pictureId);
    await user.save();
    return this.pictureModel.findByIdAndDelete(pictureId).exec();
  }

  async deleteAllForUser(user: UserFromDB) {
    return this.pictureModel.deleteMany({ userId: user._id }).exec();
  }

  async update(dto: UpdatePictureDto): Promise<PictureFromDB> {
    return this.pictureModel.findByIdAndUpdate(dto._id, { ...dto }).exec();
  }
}
