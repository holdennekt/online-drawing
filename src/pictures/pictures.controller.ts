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
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePictureDto } from './dto/createPicture.dto';
import { PicturesService } from './pictures.service';

@Controller('/pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAll(@Req() req: any) {
    return await this.picturesService.getAllForUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: ObjectId) {
    return await this.picturesService.getOneForUser(req.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreatePictureDto) {
    return await this.picturesService.create(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: ObjectId) {
    return await this.picturesService.deleteOneForUser(req.user, id);
  }
}
