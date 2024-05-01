import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto, User } from '@app/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { email } = createUserDto;
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser)
      throw new BadRequestException('Account already exist with this email');

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });

    const { password, ...payload } = newUser;

    return payload;
  }

  findAll() {
    return this.userModel.findAll();
  }

  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) throw new NotFoundException();
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
