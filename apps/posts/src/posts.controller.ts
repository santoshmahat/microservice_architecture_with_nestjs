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
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  JwtPayload,
  Post as PostEntity,
  UpdatePostDto,
} from '@app/types';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Headers('user') user: string
  ): Promise<PostEntity> {
    const userData: JwtPayload = JSON.parse(user);
    return this.postsService.create(createPostDto, userData.sub);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return this.postsService.update(+id, updatePostDto);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findOne(+id);
  }

  @Delete()
  async remove(@Param('id') id: string): Promise<void> {
    return this.postsService.remove(+id);
  }
}
