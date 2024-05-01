import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('AUTH_SERVICE_PORT');

  await app.listen(port);
}
bootstrap();
