import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: joi.object({
        API_GATEWAY_PORT: joi.string().required(),
        AUTH_SERVICE_PORT: joi.string().required(),
        AUTH_SERVICE_HOST: joi.string().required(),
        POST_SERVICE_PORT: joi.string().required(),
        POST_SERVICE_HOST: joi.string().required(),
        COMMENT_SERVICE_PORT: joi.string().required(),
        COMMENT_SERVICE_HOST: joi.string().required(),
        JWT_SECRET: joi.string().required(),
      }),
    }),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService, JwtService],
})
export class ApiGatewayModule {}
