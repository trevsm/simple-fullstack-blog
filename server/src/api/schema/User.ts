import db from "../database"
import { GraphQLError } from "graphql"
import { Errors } from "../errors"
import Crypt from "crypto-js"
import jsonwebtoken from "jsonwebtoken"

import * as dotenv from "dotenv"
import { User, UserAttributes } from "../generated/User"
dotenv.config()

export const me = async (
  _: any,
  __: any,
  { user }: { user: User }
): Promise<Omit<UserAttributes, "password"> | null> => {
  try {
    if (!user) Errors.AuthentificationError()
    console.log(user)

    const me = await db.User.findOne({ where: { user_id: user.user_id } })
    if (!me) return null

    return {
      user_id: me?.getDataValue("user_id"),
      email: me?.getDataValue("email"),
      first_name: me?.getDataValue("first_name"),
      last_name: me?.getDataValue("last_name"),
      email_optin: me?.getDataValue("email_optin"),
      email_verified: me?.getDataValue("email_verified"),
      t_created: me?.getDataValue("t_created"),
      t_updated: me?.getDataValue("t_updated"),
    }
  } catch (err) {
    throw new GraphQLError(err as string)
  }
}

export const loginUser = async (
  _: any,
  {
    email,
    password,
  }: {
    email: string
    password: string
  }
): Promise<{
  token: string
  user: Omit<UserAttributes, "password">
}> => {
  try {
    const user = await db.User.findOne({ where: { email } })
    if (!user) return Errors.UserNotFound()

    const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()

    if (hash !== user.getDataValue("password"))
      return Errors.IncorrectPassword()

    const token = jsonwebtoken.sign(
      {
        user_id: user.getDataValue("user_id"),
        email: user.getDataValue("email"),
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "2d",
      }
    )

    const userData = {
      token,
      user: {
        user_id: user.getDataValue("user_id"),
        email: user.getDataValue("email"),
        first_name: user.getDataValue("first_name"),
        last_name: user.getDataValue("last_name"),
        email_optin: user.getDataValue("email_optin"),
        email_verified: user.getDataValue("email_verified"),
        t_created: user.getDataValue("t_created"),
        t_updated: user.getDataValue("t_updated"),
      },
    }

    return userData
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

// Register a new user and issue a JWT
export const registerUser = async (
  _: any,
  {
    email,
    password,
    ...props
  }: Omit<UserAttributes, "user_id" | "t_created" | "t_updated">
): Promise<{
  token: string
  user: Omit<UserAttributes, "password">
}> => {
  try {
    // Check if user already exists using email
    const checkUser = await db.User.findOne({ where: { email } })
    if (checkUser) return Errors.UserAlreadyExists()

    const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()
    const user = await db.User.create({
      email,
      password: hash,
      t_created: new Date(),
      t_updated: new Date(),
      ...props,
    })

    const token = jsonwebtoken.sign(
      { user_id: user.user_id, email: user.getDataValue("email") },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    )

    return {
      user: {
        user_id: user.user_id,
        email: user.getDataValue("email"),
        first_name: user.getDataValue("first_name"),
        last_name: user.getDataValue("last_name"),
        email_optin: user.getDataValue("email_optin"),
        email_verified: user.getDataValue("email_verified"),
        t_created: user.getDataValue("t_created"),
        t_updated: user.getDataValue("t_updated"),
      },
      token,
    }
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}
