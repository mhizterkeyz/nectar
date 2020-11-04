import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserService } from 'src/user';
import { compare } from 'bcrypt';
import { RegisterUserDTO } from 'src/user/dtos/register_user.dto';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(user: RegisterUserDTO): Promise<User> {
    const { username } = user;
    const check = await this.userService.findSingleUser({ username });
    if (check)
      throw new BadRequestException('user already exists with username');
    const [newUser] = await this.userService.createUser(user);

    return newUser;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findSingleUser({ username });
    if (!user) return null;
    if (!(await compare(password, user.password))) return null;
    return user;
  }

  async login(user: User): Promise<{ token: string } & User> {
    const payload = pick(user, ['username', 'id']);
    payload.sub = payload.id;
    return { ...user, token: this.jwtService.sign(payload) };
  }
}
