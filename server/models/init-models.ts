import type { Sequelize } from "sequelize";
import { post as _post } from "./post";
import type { postAttributes, postCreationAttributes } from "./post";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _post as post,
  _user as user,
};

export type {
  postAttributes,
  postCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const post = _post.initModel(sequelize);
  const user = _user.initModel(sequelize);

  post.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(post, { as: "posts", foreignKey: "user_id"});

  return {
    post: post,
    user: user,
  };
}
