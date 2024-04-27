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
import { User } from './User.entity';

export class Post extends Model<Comment> {
  @Column(DataType.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  id: number;

  @Column(DataType.STRING)
  @AllowNull(false)
  title: string;

  @Column(DataType.TEXT)
  @AllowNull(false)
  content: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  @AllowNull(false)
  createdById: number;

  @BelongsTo(() => User, 'createdById')
  createdBy: User;
}
