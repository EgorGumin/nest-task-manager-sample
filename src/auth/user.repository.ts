import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CredentialsDto } from './dto/credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async register(credentialsDto: CredentialsDto): Promise<void> {
    const { username, password } = credentialsDto;
    const user = new User();
    user.username = username;
    user.password = password;

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
}
