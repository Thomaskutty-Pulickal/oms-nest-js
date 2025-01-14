import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto, TokenResponseDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() details: LoginDto): Promise<TokenResponseDto> {
    return this.authService.loginUser(details);
  }
}
