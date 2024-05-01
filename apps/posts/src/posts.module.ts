import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Post, User } from '@app/types';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        models: [Post, User],
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Post]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [PostsController],
  providers: [PostsService, JwtService],
})
export class PostsModule {}
