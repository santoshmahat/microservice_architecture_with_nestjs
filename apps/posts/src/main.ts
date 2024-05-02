import { NestFactory } from '@nestjs/core';
import { PostsModule } from './posts.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('POST_SERVICE_PORT');
  await app.listen(port);
}
bootstrap();
