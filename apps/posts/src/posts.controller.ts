import { Controller, Get, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '@app/guards';

@Controller('/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }
}
