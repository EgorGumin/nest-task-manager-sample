import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CredentialsDto } from './dto/credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {
  }

  @Post('/register')
  async register(
    @Body(ValidationPipe)
      credentialsDto: CredentialsDto,
  ): Promise<void> {
    return this.authService.register(credentialsDto);
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe)
      credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.validatePassword(credentialsDto);
  }
}
