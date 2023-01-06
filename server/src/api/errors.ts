export const Errors = {
  AuthentificationError: () => {
    throw "You are not authenticated."
  },
  UnauthorizedError: () => {
    throw "You are not authorized to perform this action."
  },
  SufficientPermissions: () => {
    throw "You do not have sufficient permissions."
  },
  IncorrectPassword: () => {
    throw "Incorrect password."
  },
  UserAlreadyExists: () => {
    throw "This email is already in use. Please try another one."
  },
  UserNotFound: () => {
    throw "User with this email does not exist."
  },
}
