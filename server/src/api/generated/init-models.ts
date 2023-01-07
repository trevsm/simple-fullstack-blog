import type { Sequelize } from "sequelize";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";
import { VerificationCode as _VerificationCode } from "./VerificationCode";
import type { VerificationCodeAttributes, VerificationCodeCreationAttributes } from "./VerificationCode";

export {
  _User as User,
  _VerificationCode as VerificationCode,
};

export type {
  UserAttributes,
  UserCreationAttributes,
  VerificationCodeAttributes,
  VerificationCodeCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const User = _User.initModel(sequelize);
  const VerificationCode = _VerificationCode.initModel(sequelize);

  VerificationCode.belongsTo(User, { as: "user", foreignKey: "user_id"});
  User.hasMany(VerificationCode, { as: "VerificationCodes", foreignKey: "user_id"});

  return {
    User: User,
    VerificationCode: VerificationCode,
  };
}
