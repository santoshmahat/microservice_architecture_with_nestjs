import { Comment, CreateCommentDto, Post, UpdateCommentDto } from '@app/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment) private readonly commentModel: typeof Comment,
    @InjectModel(Post) private readonly postModel: typeof Post
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async create(
    createCommentDto: CreateCommentDto,
    userId: number
  ): Promise<Comment> {
    const post = this.postModel.findByPk(createCommentDto.postId);

    if (!post)
      throw new NotFoundException(
        `Post with id ${createCommentDto.postId} not found.`
      );

    return await this.commentModel.create({
      ...createCommentDto,
      createdById: userId,
    });
  }

  async update(
    id: number,
    updateCommentDto: Omit<UpdateCommentDto, 'postId'>
  ): Promise<Comment> {
    const [affectedCount] = await this.commentModel.update(updateCommentDto, {
      where: { id },
    });

    if (affectedCount === 0)
      throw new NotFoundException(`Comment with id ${id} not found`);

    return this.findOne(id);
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentModel.findByPk(id);

    if (!comment)
      throw new NotFoundException(`Comment with id ${id} not found.`);

    return comment;
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentModel.findAll({ include: ['post'] });
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    comment.destroy();
  }
}
