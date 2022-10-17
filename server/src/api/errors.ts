export const Errors = {
  AuthentificationError: () => {
    throw "You are not authenticated"
  },
  UnauthorizedError: () => {
    throw "You are not authorized to perform this action"
  },
  SufficientPermissions: () => {
    throw "You do not have sufficient permissions"
  },
  InvalidCredentials: () => {
    throw "Invalid Email or Password"
  },
  UserAlreadyExists: () => {
    throw "User already exists"
  },
  UserNotFound: () => {
    throw "User not found"
  },
  PostNotFound: () => {
    throw "Post not found"
  },
}
