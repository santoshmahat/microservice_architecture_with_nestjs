import { Post } from '@app/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private readonly postModel: typeof Post) {}

  getHello(): string {
    return 'Hello World!';
  }
  async findAll() {
    return await this.postModel.findAll();
  }
}
