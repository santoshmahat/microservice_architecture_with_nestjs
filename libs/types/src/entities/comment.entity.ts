import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';
import { Post, User } from './';

export class Comment extends Model<Comment> {
  @Column(DataType.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  id: number;

  @Column(DataType.TEXT)
  @AllowNull(false)
  content: string;

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  postId: number;

  @BelongsTo(() => Post, 'postId')
  post: Post;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  createdById: number;

  @BelongsTo(() => User, 'createdById')
  createdBy: User;
}
