import { ApolloError } from "@apollo/client"

export const useErrorResolver = (error: ApolloError) => {
  if (error.graphQLErrors) {
    error.graphQLErrors.forEach((err) => {
      console.error(err.message)
    })
  }
}
