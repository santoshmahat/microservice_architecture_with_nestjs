import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { User } from '@app/types';
import { SequelizeModule } from '@nestjs/sequelize';
import * as joi from 'joi';

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        models: [User],
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

        JWT_SECRET: joi.string().required(),
        JWT_EXPIRES_IN: joi.string().required(),

        // API_GATEWAY_PORT: joi.string().required(),
        AUTH_SERVICE_PORT: joi.string().required(),
        // POST_SERVICE_PORT: joi.string().required(),
        // COMMENT_SERVICE_PORT: joi.string().required(),

        // API_GATEWAY_HOST: joi.string().required(),
        // AUTH_SERVICE_HOST: joi.string().required(),
        // POST_SERVICE_HOST: joi.string().required(),
        // COMMENT_SERVICE_HOST: joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: JSON.parse(configService.get('JWT_EXPIRES_IN')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
