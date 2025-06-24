import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    //console.log('JwtGuard - Début de la vérification');
    
    const request = context.switchToHttp().getRequest();
/*     console.log('JwtGuard - Request Headers:', request.headers);
    console.log('JwtGuard - Authorization Header:', request.headers.authorization); */
    
    // Vérifier si la route est marquée comme publique
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //console.log('JwtGuard - Route publique:', isPublic);

    // Si la route est publique, on autorise sans vérification
    if (isPublic) {
      return true;
    }

    // Vérifier si le token est présent
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      //console.error('JwtGuard - No Authorization header found');
      throw new UnauthorizedException('No auth token');
    }

    if (!authHeader.startsWith('Bearer ')) {
      //console.error('JwtGuard - Invalid Authorization header format');
      throw new UnauthorizedException('Invalid token format');
    }

    // Sinon vérification d'authentification JWT
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    //console.log('JwtGuard - Résultat de la validation:', { err, user, info });
    
    // Si une erreur ou pas d'utilisateur
    if (err || !user) {
      //console.log('JwtGuard - Erreur d\'authentification:', err || 'Pas d\'utilisateur');
      if (info && info.message) {
        throw new UnauthorizedException(info.message);
      }
      throw err || new UnauthorizedException('Authentification requise');
    }
    
    //console.log('JwtGuard - Utilisateur authentifié:', user);
    return user;
  }
} 