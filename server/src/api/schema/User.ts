import db from "../database"
import { GraphQLError } from "graphql"
import { Errors } from "../errors"
import Crypt from "crypto-js"
import jsonwebtoken from "jsonwebtoken"

import * as dotenv from "dotenv"
import { User, UserAttributes } from "../generated/User"
import { sendEmail } from "../../tools/sendEmail"
dotenv.config()

const allUserAttributes = (user: User) => ({
  user_id: user.getDataValue("user_id"),
  email: user.getDataValue("email"),
  first_name: user.getDataValue("first_name"),
  last_name: user.getDataValue("last_name"),
  email_optin: user.getDataValue("email_optin"),
  email_verified: user.getDataValue("email_verified"),
  t_created: user.getDataValue("t_created"),
  t_updated: user.getDataValue("t_updated"),
})

export const me = async (
  _: any,
  __: any,
  { user }: { user: User }
): Promise<Omit<UserAttributes, "password"> | null> => {
  try {
    if (!user) Errors.AuthentificationError()

    const currentUser = await db.User.findOne({
      where: { user_id: user.user_id },
    })
    if (!currentUser) return Errors.UserNotFound()

    return allUserAttributes(currentUser)
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
      user: allUserAttributes(user),
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
    const newUser = await db.User.create({
      email,
      password: hash,
      t_created: new Date(),
      t_updated: new Date(),
      ...props,
    })

    const token = jsonwebtoken.sign(
      { user_id: newUser.user_id, email: newUser.getDataValue("email") },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    )

    // Create a new verification code
    const vfcode = await db.VerificationCode.create({
      user_id: newUser.user_id,
      code_value: Math.floor(100000 + Math.random() * 900000),
    })

    const code = vfcode.getDataValue("code_value")

    // send verification email
    const msg = {
      to: newUser.getDataValue("email"),
      from: " <CompanyName>",
      subject: "Verify your email",
      text: `Your verification code is ${code}`,
      html: `<strong>Your verification code is ${code}</strong>`,
    }

    const info = await sendEmail(msg)

    return {
      user: { ...allUserAttributes(newUser), user_id: newUser.user_id },
      token,
    }
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}

// update any fields of a user: ("email", "first_name", "last_name", "email_optin")
export const updateUser = async (
  _: any,
  {
    email,
    password,
    first_name,
    last_name,
    email_optin,
  }: {
    email?: string
    password?: string
    first_name?: string
    last_name?: string
    email_optin?: number
  },
  { user }: { user: User }
): Promise<Omit<UserAttributes, "password">> => {
  try {
    if (!user) Errors.AuthentificationError()

    const currentUser = await db.User.findOne({
      where: { user_id: user.user_id },
    })
    if (!currentUser) return Errors.UserNotFound()

    if (first_name || last_name || email_optin !== undefined) {
      db.User.update(
        {
          first_name,
          last_name,
          email_optin,
        },
        { where: { user_id: user.user_id } }
      )
    }

    if (email) {
      const checkUser = await db.User.findOne({ where: { email } })
      if (checkUser) return Errors.UserAlreadyExists()

      // This is a new email, so we need to verify it
      // @Note: if the user already verified the previous email,
      // then change to a new one, and then change back to the previous one,
      // the user will have to verify the email again... (not a big deal for now)
      currentUser.update({
        email,
        email_verified: 0,
      })
    }

    if (password) {
      const hash = Crypt.SHA512(password + process.env.PASS_SECRET).toString()
      db.User.update({ password: hash }, { where: { user_id: user.user_id } })
    }

    return allUserAttributes(currentUser)
  } catch (e) {
    throw new GraphQLError(e as string)
  }
}
