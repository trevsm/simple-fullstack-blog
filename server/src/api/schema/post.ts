import { GraphQLError } from "graphql"
import db from "../database"
import { Errors } from "../errors"

export const createPost = async (
  _: any,
  { title, content }: any,
  { user }: any
) => {
  try {
    if (!user) return Errors.AuthentificationError()

    const post = await db.post.create({ user_id: user.id, title, content })

    return {
      id: post.id,
      user_id: post.getDataValue("user_id"),
      title: post.getDataValue("title"),
      content: post.getDataValue("content"),
    }
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const updatePost = async (
  _: any,
  { id, title, content }: any,
  { user }: any
) => {
  try {
    if (!user) return Errors.AuthentificationError()

    await db.post.update({ id, title, content }, { where: { id } })
    const newPost = await db.post.findOne({ where: { id } })
    return newPost
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const deletePost = async (_: any, { id }: any, { user }: any) => {
  try {
    if (!user) return Errors.AuthentificationError()

    await db.post.destroy({ where: { id } })
    return "Post deleted"
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const allPosts = async (_: any, __: any, { user }: any) => {
  try {
    // No need for authentification here
    // if (!user) return Errors.AuthentificationError()

    const posts = await db.post.findAll({ where: { user_id: user.id } })
    return posts.map((post: any) => ({
      id: post.getDataValue("id"),
      user_id: post.getDataValue("user_id"),
      title: post.getDataValue("title"),
      content: post.getDataValue("content"),
    }))
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const allUserPosts = async (_: any, { id }: any, { user }: any) => {
  try {
    // No need for authentification here
    // if (!user) return Errors.AuthentificationError()

    const posts = await db.post.findAll({ where: { user_id: id } })
    return posts.map((post: any) => ({
      id: post.getDataValue("id"),
      user_id: post.getDataValue("user_id"),
      title: post.getDataValue("title"),
      content: post.getDataValue("content"),
    }))
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}
