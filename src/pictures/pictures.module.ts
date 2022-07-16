import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { PicturesController } from './pictures.controller';
import { PicturesGateway } from './pictures.gateway';
import { PicturesService } from './pictures.service';
import { Picture, PictureSchema } from './schema/pictures.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Picture.name, schema: PictureSchema }]),
    AuthModule,
  ],
  controllers: [PicturesController],
  providers: [PicturesService, PicturesGateway],
  exports: [PicturesService],
})
export class PicturesModule {}
