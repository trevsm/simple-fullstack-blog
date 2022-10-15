import db from "../database"
import { GraphQLError } from "graphql"
import { Errors } from "../errors"
import Crypt from "crypto-js"
import jsonwebtoken from "jsonwebtoken"

import * as dotenv from "dotenv"
dotenv.config()

export const me = async (_: any, __: any, { user }: any) => {
  if (!user) throw new GraphQLError("You are not authenticated")
  return await db.user.findByPk(user.id)
}

export const user = async (_: any, { user_id }: any, { user }: any) => {
  try {
    if (!user) Errors.AuthentificationError()

    const foundUser = await db.user.findOne({ where: { user_id } })
    if (!foundUser) {
      throw new Error("User not found")
    }

    return {
      user_id: foundUser.getDataValue("user_id"),
      email: foundUser.getDataValue("email"),
      password: foundUser.getDataValue("password"),
    }
  } catch (e) {
    throw new GraphQLError("No user found")
  }
}

export const allUsers = async (root: any, args: any, { user }: any) => {
  try {
    if (!user) return Errors.AuthentificationError()

    const users = await db.user.findAll()
    if (!users) return null

    return users.map((user) => ({
      email: user.getDataValue("email"),
    }))
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const login = async (_: any, { email, password }: any) => {
  try {
    const user = await db.user.findOne({ where: { email } })
    if (!user) return Errors.InvalidCredentials()

    const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()
    console.log(process.env.PASS_SECRET)

    if (hash !== user.getDataValue("password"))
      return Errors.InvalidCredentials()

    const token = jsonwebtoken.sign(
      {
        id: user.getDataValue("user_id"),
        email: user.getDataValue("email"),
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "2d",
      }
    )

    return {
      token,
      user: {
        user_id: user.getDataValue("user_id"),
        email: user.getDataValue("email"),
      },
    }
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

// Register a new user and issue a JWT
export const registerUser = async (_: any, { email, password }: any) => {
  try {
    // Check if user already exists using email
    const checkUser = await db.user.findOne({ where: { email } })
    if (checkUser) throw new Error("User already exists")

    const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()
    const user = await db.user.create({ email, password: hash })

    const token = jsonwebtoken.sign(
      { id: user.getDataValue("user_id"), email: user.getDataValue("email") },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    )

    return {
      user: {
        user_id: user.getDataValue("user_id"),
        email: user.getDataValue("email"),
      },
      token,
    }
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const updateUser = async (
  _: any,
  { id, email, password }: any,
  { user }: any
) => {
  try {
    if (!user) return Errors.AuthentificationError()

    const foundUser = await db.user.findOne({ where: { user_id: id } })
    if (!foundUser) throw new Error("User not found")

    if (password) {
      const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()
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

export const deleteUser = async (_: any, { id }: any, { user }: any) => {
  try {
    if (!user) return Errors.AuthentificationError()

    const foundUser = await db.user.findOne({ where: { user_id: id } })
    if (!foundUser) throw new Error("User not found")

    if (foundUser.getDataValue("user_id") !== user.id)
      return Errors.SufficientPermissions()

    await db.user.destroy({ where: { user_id: id } })
    return "User deleted!"
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}
