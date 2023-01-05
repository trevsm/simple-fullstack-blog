import db from "../database"
import { GraphQLError } from "graphql"
import { Errors } from "../errors"
import Crypt from "crypto-js"
import jsonwebtoken from "jsonwebtoken"

import * as dotenv from "dotenv"
dotenv.config()

export const me = async (_: any, __: any, { user }: any) => {
  try {
    if (!user) Errors.AuthentificationError()

    const me = await db.user.findOne({ where: { id: user.id } })
    if (!me) return null

    return {
      id: me?.getDataValue("id"),
      email: me?.getDataValue("email"),
    }
  } catch (err) {
    throw new GraphQLError(err as string)
  }
}

export const user = async (_: any, { id }: any, { user }: any) => {
  try {
    // No need for authentification here
    // if (!user) Errors.AuthentificationError()

    const foundUser = await db.user.findOne({ where: { id } })
    if (!foundUser) return Errors.UserNotFound()

    return {
      id: foundUser.getDataValue("id"),
      email: foundUser.getDataValue("email"),
      password: foundUser.getDataValue("password"),
    }
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const allUsers = async (_: any, __: any, { user }: any) => {
  try {
    // No need for authentification here
    // if (!user) return Errors.AuthentificationError()

    const users = await db.user.findAll()
    if (!users) return null

    return users.map((user) => ({
      id: user.getDataValue("id"),
      email: user.getDataValue("email"),
    }))
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

export const login = async (_: any, { email, password }: any) => {
  try {
    const user = await db.user.findOne({ where: { email } })
    if (!user) return Errors.UserNotFound()

    const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()

    if (hash !== user.getDataValue("password"))
      return Errors.IncorrectPassword()

    const token = jsonwebtoken.sign(
      {
        id: user.getDataValue("id"),
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
        id: user.getDataValue("id"),
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
    if (checkUser) return Errors.UserAlreadyExists()

    const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()
    const user = await db.user.create({ email, password: hash })

    const token = jsonwebtoken.sign(
      { id: user.id, email: user.getDataValue("email") },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    )

    return {
      user: {
        id: user.id,
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

    const foundUser = await db.user.findOne({ where: { id: id } })
    if (!foundUser) return Errors.UserNotFound()

    if (password) {
      const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()
      await db.user.update({ password: hash }, { where: { id: id } })
    }

    if (email) await db.user.update({ email }, { where: { id: id } })

    const updatedUser = await db.user.findOne({ where: { id: id } })
    if (!updatedUser) return Errors.UserNotFound()

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

    const foundUser = await db.user.findOne({ where: { id: id } })
    if (!foundUser) throw new Error("User not found")

    if (foundUser.id !== user.id) return Errors.SufficientPermissions()

    await db.user.destroy({ where: { id: id } })
    return "User deleted!"
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}
