import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { UpdatePictureDto } from './dto/updatePicture.dto';

@WebSocketGateway(3001)
export class PicturesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('picture')
  handlePicture(@MessageBody() picture: UpdatePictureDto): void {
    console.log(picture);
  }
}
