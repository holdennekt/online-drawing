import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserFromDB } from 'src/users/schema/user.schema';

type JwtToken = { access_token: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(dto: UserDto): Promise<UserFromDB> {
    if (!dto.name || !dto.password) {
      throw new UnauthorizedException('user data has not been provided');
    }
    const user = await this.usersService.getUserByName(dto.name);
    if (user !== null) {
      const matched = await bcrypt.compare(dto.password, user.password);
      if (matched) return user;
      throw new UnauthorizedException(
        `incorrect password for user ${user.name}`,
      );
    }
    throw new UnauthorizedException(`no such user ${dto.name}`);
  }

  private async createUser(dto: UserDto): Promise<UserFromDB> {
    if (!dto.name || !dto.password) {
      throw new UnauthorizedException('user data has not been provided');
    }
    const user = await this.usersService.getUserByName(dto.name);
    if (user !== null) {
      throw new HttpException(
        `user ${user.name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 5);
    return await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });
  }

  async login(user: UserFromDB): Promise<JwtToken> {
    return this.genegateToken(user);
  }

  async register(dto: UserDto): Promise<JwtToken> {
    const user = await this.createUser(dto);
    return this.genegateToken(user);
  }

  private genegateToken(user: UserFromDB): JwtToken {
    const partOfUser = { _id: user._id, name: user.name };
    return { access_token: this.jwtService.sign(partOfUser) };
  }
}
