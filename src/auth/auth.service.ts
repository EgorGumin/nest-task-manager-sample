import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
  }

  async register(credentialsDto: CredentialsDto) {
    return this.userRepository.register(credentialsDto);
  }

  async validatePassword(credentialsDto: CredentialsDto) {
    const { username, password} = credentialsDto;
    const user = await this.userRepository.getUserByUsername(username);
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (passwordIsValid) {
      return username;
    } else {
      throw new ForbiddenException(`Incorrect password`);
    }

  }
}
