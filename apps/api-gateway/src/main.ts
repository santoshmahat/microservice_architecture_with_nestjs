import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);

  const port = configService.get<string>('API_GATEWAY_PORT');

  const authServicePort = configService.get<string>('AUTH_SERVICE_PORT');
  const authServiceHost = configService.get<string>('AUTH_SERVICE_HOST');

  const postServicePort = configService.get<string>('POST_SERVICE_PORT');
  const postServiceHost = configService.get<string>('POST_SERVICE_HOST');

  const checkAuthentication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [type, bearerToken] = req?.headers?.authorization?.split(' ') ?? [];
      const token = type === 'Bearer' ? bearerToken : undefined;
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }
      const decodedUser = await jwtService.verify(token, {
        secret: configService.get('JWT_SECRET'),
      });

      req['user'] = decodedUser;
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };

  app.use(
    '/api/auth',
    (req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/login')) {
        return next();
      }
      checkAuthentication(req, res, next);
    },
    createProxyMiddleware({
      target: `http://${authServiceHost}:${authServicePort}`,
    })
  );

  app.use(
    '/api/post',
    checkAuthentication,
    createProxyMiddleware({
      target: `http://${postServiceHost}:${postServicePort}`,
    })
  );

  await app.listen(port);
}
bootstrap();
