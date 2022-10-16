import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
dotenv.config()

export default ({ req }: any) => {
  const token = req.get("Authorization")
  if (!token) return { isAuth: false }

  let user: any

  try {
    user = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET as string
    )
  } catch (err) {
    console.log(err)

    return { isAuth: false }
  }

  // in case any error found
  if (!user) return { isAuth: false }

  // token decoded successfully, and extracted data
  return { isAuth: true, user }
}
