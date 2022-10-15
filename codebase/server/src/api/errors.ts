export const Errors = {
  AuthentificationError: () => {
    throw new Error("You are not authenticated")
  },
  SufficientPermissions: () => {
    throw new Error("You do not have sufficient permissions")
  },
  InvalidCredentials: () => {
    throw new Error("Invalid Email or Password")
  },
}
