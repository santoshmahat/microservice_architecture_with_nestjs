import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @Column(DataType.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  id: number;

  @Column(DataType.STRING)
  @AllowNull(false)
  firstName: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  lastName: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  @Unique(true)
  email: string;

  @Column(DataType.STRING)
  @AllowNull(false)
  password: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
