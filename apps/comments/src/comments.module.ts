import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Post, Comment, User } from '@app/types';
import * as joi from 'joi';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        models: [Post, Comment, User],
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        DB_NAME: joi.string().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_DIALECT: joi.string().required(),
        DB_HOST: joi.string().required(),
        COMMENT_SERVICE_PORT: joi.string().required(),
      }),
    }),
    SequelizeModule.forFeature([Post, Comment]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
