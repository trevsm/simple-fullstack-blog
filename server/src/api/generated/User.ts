import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  user_id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  email_optin: number;
  email_verified: number;
  t_created?: Date;
  t_updated?: Date;
}

export type UserPk = "user_id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "user_id" | "email_optin" | "email_verified" | "t_created" | "t_updated";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  user_id!: number;
  email!: string;
  password!: string;
  first_name!: string;
  last_name!: string;
  email_optin!: number;
  email_verified!: number;
  t_created?: Date;
  t_updated?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "email"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email_optin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    t_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    t_updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'User',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
  }
}
