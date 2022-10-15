import db from "../database"
import { GraphQLError } from "graphql"
import Crypt from "crypto-js"

export const user = async (_: any, { email }: any) => {
  try {
    const user = await db.user.findOne({ where: { email: email } })
    if (!user) {
      throw new Error("User not found")
    }

    return {
      user_id: user.getDataValue("user_id"),
      email: user.getDataValue("email"),
      password: user.getDataValue("password"),
    }
  } catch (e) {
    throw new GraphQLError("No user found")
  }
}

export const allUsers = async () => {
  const users = await db.user.findAll()
  if (!users) return null

  return users.map((user) => ({
    email: user.getDataValue("email"),
  }))
}

export const createUser = async (_: any, { email, password }: any) => {
  try {
    const checkUser = await db.user.findOne({ where: { email } })
    if (checkUser) throw new Error("User already exists")

    const hash = Crypt.SHA512(password + process.env.SECRET).toString()
    const data = await db.user.create({ email, password: hash })
    return {
      email: data.getDataValue("email"),
    }
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const updateUser = async (_: any, { id, email, password }: any) => {
  try {
    const user = await db.user.findOne({ where: { user_id: id } })
    if (!user) throw new Error("User not found")

    if (password) {
      const hash = Crypt.SHA512(password + process.env.SECRET).toString()
      await db.user.update({ password: hash }, { where: { user_id: id } })
    }

    if (email) await db.user.update({ email }, { where: { user_id: id } })

    const updatedUser = await db.user.findOne({ where: { user_id: id } })
    if (!updatedUser) throw new Error("User not found")

    return {
      email: updatedUser.getDataValue("email"),
    }
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const deleteUser = async (_: any, { id }: any) => {
  try {
    const user = await db.user.findOne({ where: { user_id: id } })
    if (!user) throw new Error("User not found")

    await db.user.destroy({ where: { user_id: id } })
    return "User deleted!"
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}
