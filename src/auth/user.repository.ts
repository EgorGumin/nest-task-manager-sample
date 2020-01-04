import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CredentialsDto } from './dto/credentials.dto';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async register(credentialsDto: CredentialsDto): Promise<void> {
    const { username, password } = credentialsDto;
    const user = new User();
    user.username = username;

    const salt: string = await bcrypt.genSalt();

    const hashedPassword: string = await UserRepository.hashPassword(password, salt);
    user.password = hashedPassword;

    try {
      await user.save();
    } catch (error) {
      const DUPLICATE_KEY_ERROR = '23505';
      if (error.code === DUPLICATE_KEY_ERROR) {
        throw new ConflictException(`Username "${username}" is already taken. Choose another one`);
      } else {
        throw new InternalServerErrorException(`Can't create a user. Try again later.`);
      }
    }
  }

  private static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.findOne({username});
    if (user) {
      return user;
    } else {
      throw new NotFoundException(`Can't find user with username "${username}"`);
    }
  }
}
