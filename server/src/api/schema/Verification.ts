import db from "../database"
import { GraphQLError } from "graphql"
import { Errors } from "../errors"

import * as dotenv from "dotenv"
import { User, UserAttributes } from "../generated/User"
dotenv.config()

export const verifyEmail = async (
  _: any,
  { code_value }: { code_value: number },
  { user }: { user: User }
): Promise<Omit<UserAttributes, "password">> => {
  // verify user exists in db
  const foundUser = await db.User.findOne({ where: { user_id: user.user_id } })

  if (!foundUser) return Errors.UserNotFound()

  // verify user is not already verified
  if (foundUser.email_verified) return Errors.AlreadyVerified()

  // verify code exists in db and matches one of the user's codes
  const foundCode = await db.VerificationCode.findOne({
    where: { user_id: user.user_id, code_value },
  })

  if (!foundCode) return Errors.InvalidVerificationCode()

  // @TODO
  // verify code is not expired (30 minutes)
  // const now = new Date()
  // const codeDate = new Date(foundCode.t_created)
  // const diff = now.getTime() - codeDate.getTime()
  // const diffMinutes = diff / 1000 / 60

  // if (diffMinutes > 30) return Errors.InvalidVerificationCode()

  // if all checks pass, update user's email_verified to true
  await db.User.update(
    { email_verified: 1 },
    { where: { user_id: user.user_id } }
  )

  // delete code from db
  await db.VerificationCode.destroy({
    where: {
      user_id: user.user_id,
      code_value,
    },
  })

  const updatedUser = await db.User.findOne({
    where: { user_id: user.user_id },
  })

  if (!updatedUser) return Errors.UserNotFound()

  // return user object
  return {
    user_id: updatedUser.getDataValue("user_id"),
    email: updatedUser.getDataValue("email"),
    first_name: updatedUser.getDataValue("first_name"),
    last_name: updatedUser.getDataValue("last_name"),
    email_optin: updatedUser.getDataValue("email_optin"),
    email_verified: updatedUser.getDataValue("email_verified"),
    t_created: updatedUser.getDataValue("t_created"),
    t_updated: updatedUser.getDataValue("t_updated"),
  }
}
