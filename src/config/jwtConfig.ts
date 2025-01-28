import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  global: true,
  useFactory: () => ({
    secret: process.env.JWT_SECRET || 'no',
    signOptions: {
      expiresIn: '10h',
    },
  }),
};
