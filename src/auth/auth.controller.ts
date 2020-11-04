import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user';
import { RegisterUserDTO } from 'src/user/dtos/register_user.dto';
import { AuthService } from './auth.service';
import { JWTGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async join(@Body() user: RegisterUserDTO): Promise<User> {
    return this.authService.registerUser(user);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('/login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(JWTGuard)
  @Get('profile')
  async profile(@Request() req): Promise<any> {
    return req.user;
  }
}
