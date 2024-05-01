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

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email } = createUserDto;
    const existingUser = await this.findOneByEmail(email);
    if (existingUser)
      throw new BadRequestException('Account already exist with this email');

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });

    return newUser;
  }

  findAll() {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const [affectedCount] = await this.userModel.update(updateUserDto, {
      where: { id },
    });

    if (affectedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.destroy();
  }
}
