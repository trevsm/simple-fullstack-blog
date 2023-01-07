import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface VerificationCodeAttributes {
  code_id: number;
  user_id: number;
  code_value: number;
  t_created?: Date;
}

export type VerificationCodePk = "code_id";
export type VerificationCodeId = VerificationCode[VerificationCodePk];
export type VerificationCodeOptionalAttributes = "code_id" | "t_created";
export type VerificationCodeCreationAttributes = Optional<VerificationCodeAttributes, VerificationCodeOptionalAttributes>;

export class VerificationCode extends Model<VerificationCodeAttributes, VerificationCodeCreationAttributes> implements VerificationCodeAttributes {
  code_id!: number;
  user_id!: number;
  code_value!: number;
  t_created?: Date;

  // VerificationCode belongsTo User via user_id
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof VerificationCode {
    return VerificationCode.init({
    code_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    code_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    t_created: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'VerificationCode',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
