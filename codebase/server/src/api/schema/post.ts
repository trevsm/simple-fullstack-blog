import db from "../database"

export const createPost = async (_: any, { user_id, title, content }: any) => {
  const data = await db.post.create({ user_id, title, content })
  return {
    id: data.id,
    user_id: data.getDataValue("user_id"),
    title: data.getDataValue("title"),
    content: data.getDataValue("content"),
  }
}

export const updatePost = async (
  _: any,
  { id, user_id, title, content }: any
) => {
  await db.post.update({ user_id, title, content }, { where: { id } })
  const newPost = await db.post.findOne({ where: { id } })
  return newPost
}

export const deletePost = async (_: any, { id }: any) => {
  await db.post.destroy({ where: { id } })
  return "Post deleted"
}
