import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

export interface UserInfoRequest extends Request {
  user: JwtPayload;
}
