import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ClientRequest } from 'http';
import { UserInfoRequest } from '@app/types';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);

  const port = configService.get<string>('API_GATEWAY_PORT');

  const authServicePort = configService.get<string>('AUTH_SERVICE_PORT');
  const authServiceHost = configService.get<string>('AUTH_SERVICE_HOST');

  const postServicePort = configService.get<string>('POST_SERVICE_PORT');
  const postServiceHost = configService.get<string>('POST_SERVICE_HOST');

  const commentServicePort = configService.get<string>('COMMENT_SERVICE_PORT');
  const commentServiceHost = configService.get<string>('COMMENT_SERVICE_HOST');

  const onProxyReq = (
    _proxyReq: ClientRequest,
    req: UserInfoRequest,
    res: Response
  ) => {
    try {
      if (req.path.includes('/login')) return;

      const [type, bearerToken] = req?.headers?.authorization?.split(' ') ?? [];
      const token = type === 'Bearer' ? bearerToken : undefined;
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }
      const decodedUser = jwtService.verify(token, {
        secret: configService.get('JWT_SECRET'),
      });
      _proxyReq.setHeader('user', JSON.stringify(decodedUser));
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: `http://${authServiceHost}:${authServicePort}`,
      changeOrigin: true,
      on: {
        proxyReq: onProxyReq,
      },
    })
  );

  app.use(
    '/api/post',
    createProxyMiddleware({
      target: `http://${postServiceHost}:${postServicePort}`,
      changeOrigin: true,
      on: {
        proxyReq: onProxyReq,
      },
    })
  );

  app.use(
    '/api/comment',
    createProxyMiddleware({
      target: `http://${commentServiceHost}:${commentServicePort}`,
      changeOrigin: true,
      on: {
        proxyReq: onProxyReq,
      },
    })
  );

  await app.listen(port);
}
bootstrap();
