import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtContants } from 'src/auth/schema/constants';
import { User, UserService } from 'src/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      secretOrKey: jwtContants.secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: string }): Promise<User> {
    const user = await this.userService.findSingleUser({ id: payload.id });
    if (!user) {
      throw new ForbiddenException('not enough permission for request');
    }
    return user;
  }
}
