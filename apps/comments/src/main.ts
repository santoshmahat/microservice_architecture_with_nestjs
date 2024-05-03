import { NestFactory } from '@nestjs/core';
import { CommentsModule } from './comments.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CommentsModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('COMMENT_SERVICE_PORT');
  await app.listen(port);
}
bootstrap();
