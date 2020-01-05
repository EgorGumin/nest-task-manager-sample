import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {
  }

  async register(credentialsDto: CredentialsDto) {
    return this.userRepository.register(credentialsDto);
  }

  async validatePassword(credentialsDto: CredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = credentialsDto;
    const user = await this.userRepository.getUserByUsername(username);
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (passwordIsValid) {
      const jwtPayload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(jwtPayload);
      return { accessToken };
    } else {
      throw new ForbiddenException(`Incorrect password`);
    }

  }
}
