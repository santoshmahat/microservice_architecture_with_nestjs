import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  Comment,
  CreateCommentDto,
  JwtPayload,
  UpdateCommentDto,
} from '@app/types';

@Controller('/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Headers('user') user: string
  ): Promise<Comment> {
    const userData: JwtPayload = JSON.parse(user);
    return this.commentsService.create(createCommentDto, userData.sub);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: Omit<UpdateCommentDto, 'postId'>
  ): Promise<Comment> {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Get()
  async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(+id);
  }

  @Delete()
  async remove(@Param('id') id: string): Promise<void> {
    return this.commentsService.remove(+id);
  }
}
