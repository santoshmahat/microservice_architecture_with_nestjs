import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('API_GATEWAY_PORT');

  const authServicePort = configService.get<string>('AUTH_SERVICE_PORT');
  const authServiceHost = configService.get<string>('AUTH_SERVICE_HOST');

  const postServicePort = configService.get<string>('POST_SERVICE_PORT');
  const postServiceHost = configService.get<string>('POST_SERVICE_HOST');

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: `http://${authServiceHost}:${authServicePort}`,
    })
  );

  app.use(
    '/api/post',
    createProxyMiddleware({
      target: `http://${postServiceHost}:${postServicePort}`,
    })
  );

  await app.listen(port);
}
bootstrap();
