import { Injectable } from '@nestjs/common';
import { clone, find } from 'lodash';
import { hash, hashSync } from 'bcrypt';
import { RegisterUserDTO } from './dtos/register_user.dto';
import { User } from './interfaces';

@Injectable()
export class UserService {
  private users: User[];

  constructor() {
    this.users = [
      {
        username: 'john',
        fullname: 'John Doe',
        password: hashSync('password', 10),
        id: 0,
      },
    ];
  }

  async createUser(user: RegisterUserDTO): Promise<User[]> {
    const userObj = clone(user);
    userObj.id = this.users.length;
    userObj.password = await hash(userObj.password, 10);
    this.users.push(userObj);

    delete userObj.password;
    return [userObj];
  }

  async findSingleUser(params: Record<string, any>): Promise<User | null> {
    const user = find(this.users, params);

    if (user) return user;
    return null;
  }
}
