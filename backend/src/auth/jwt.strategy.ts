import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from './enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'rE6WYhg:KfS87dk93sT!qLp29xW8vY!s',
    });
    //console.log('JwtStrategy - Secret:', process.env.JWT_SECRET || 'rE6WYhg:KfS87dk93sT!qLp29xW8vY!s');
  }

  async validate(payload: JwtPayload) {
    //console.log('JwtStrategy - Validating payload:', payload);
    if (!payload || !payload.sub || !payload.email || !payload.role) {
      //console.error('JwtStrategy - Invalid payload:', payload);
      return null;
    }
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
} 