import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Post, User } from './';

@Table({
  tableName: 'comments',
})
export class Comment extends Model<Comment> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content: string;

  @ForeignKey(() => Post)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  postId: number;

  @BelongsTo(() => Post, 'postId')
  post: Post;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  createdById: number;

  @BelongsTo(() => User, 'createdById')
  createdBy: User;
}
