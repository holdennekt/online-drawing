import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { PicturesService } from 'src/pictures/pictures.service';
import { UserDto } from './dto/user.dto';
import { User, UserDocument, UserFromDB } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly picturesService: PicturesService,
  ) {}

  async getAllUsers(): Promise<UserFromDB[]> {
    return this.userModel.find().exec();
  }

  async getUserByName(name: string): Promise<UserFromDB> {
    return this.userModel.findOne({ name }).exec();
  }

  async getUserById(id: ObjectId): Promise<UserFromDB> {
    return this.userModel.findById(id).exec();
  }

  async createUser(dto: UserDto): Promise<UserFromDB> {
    return this.userModel.create({ ...dto, pictures: [] });
  }

  async deleteUser(user: UserFromDB): Promise<UserFromDB> {
    await this.picturesService.deleteAllForUser(user);
    return this.userModel.findByIdAndDelete(user._id).exec();
  }
}
