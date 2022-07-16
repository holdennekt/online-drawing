import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() dto: UserDto) {
    return this.authService.register(dto);
  }
}
