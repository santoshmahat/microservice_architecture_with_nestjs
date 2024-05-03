import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: true })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  postId: number;
}
