import {
  CanActivate,
  ExecutionContext,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const jwtToken = request.header('jwt');

    if (!jwtToken) this.throwUnAutherizedException();

    try {
      const jwtValidationResult = await this.jwtService.verifyAsync(jwtToken);
      request.push({ user: jwtValidationResult });
      return true;
    } catch (e) {
      this.throwUnAutherizedException();
    }
  }

  throwUnAutherizedException() {
    throw new HttpException(
      'your cant access because your are not logged in',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
