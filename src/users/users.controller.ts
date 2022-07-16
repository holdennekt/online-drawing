import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: provide guards

  @Get('/all')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':name')
  async getUserByName(@Param('name') name: string) {
    return await this.usersService.getUserByName(name);
  }

  @Post()
  async createUser(@Body() dto: UserDto) {
    return await this.usersService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUserByName(@Req() req: any) {
    return await this.usersService.deleteUser(req.user);
  }
}
