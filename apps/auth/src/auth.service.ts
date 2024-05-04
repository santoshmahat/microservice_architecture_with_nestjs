import { CreateUserDto, LoginDto, User } from '@app/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return new BadRequestException('Password is incorrect');
    const jwtToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      message: 'User is login successfully',
      token: jwtToken,
    };
  }

  async register(
    createUserDto: CreateUserDto
  ): Promise<Omit<User, 'password'>> {
    return await this.usersService.create(createUserDto);
  }
}
