import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CredentialsDto } from './dto/credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async register(credentialsDto: CredentialsDto): Promise<void> {
    const { username, password } = credentialsDto;
    const user = new User();
    user.username = username;
    user.password = password;

    await user.save();
  }
}
