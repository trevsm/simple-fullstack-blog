export const Errors = {
  AuthentificationError: () => {
    throw new Error("You are not authenticated")
  },
  UnauthorizedError: () => {
    throw new Error("You are not authorized to perform this action")
  },
  SufficientPermissions: () => {
    throw new Error("You do not have sufficient permissions")
  },
  InvalidCredentials: () => {
    throw new Error("Invalid Email or Password")
  },
  UserAlreadyExists: () => {
    throw new Error("User already exists")
  },
  UserNotFound: () => {
    throw new Error("User not found")
  },
  PostNotFound: () => {
    throw new Error("Post not found")
  },
}
