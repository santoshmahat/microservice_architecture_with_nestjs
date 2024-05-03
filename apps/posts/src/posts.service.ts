import { CreatePostDto, Post, UpdatePostDto } from '@app/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private readonly postModel: typeof Post) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    console.log('userId', userId, typeof userId);
    return await this.postModel.create({
      ...createPostDto,
      createdById: userId,
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const [affectedCount] = await this.postModel.update(updatePostDto, {
      where: { id },
    });

    if (affectedCount === 0) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return this.findOne(id);
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postModel.findByPk(id);

    if (!post) throw new NotFoundException(`Post with id ${id} not found.`);

    return post;
  }

  async findAll(): Promise<Post[]> {
    return await this.postModel.findAll();
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await post.destroy();
  }
}
