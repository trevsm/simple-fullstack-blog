import { gql } from "apollo-server-express"
import { me, registerUser, loginUser } from "./User"
import { verifyEmail } from "./Verification"

export const typeDefs = gql`
  type User {
    user_id: Int!
    email: String!
    first_name: String!
    last_name: String!
    email_optin: Boolean!
    email_verified: Boolean!
    t_created: String!
    t_updated: String!
  }

  type VerificationCode {
    code_id: Int!
    user_id: Int!
    code_value: Int!
    t_created: String!
  }

  type Error {
    error: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # User queries
    me: User
  }

  type Mutation {
    # User Mutations
    loginUser(email: String!, password: String!): AuthPayload!
    registerUser(
      email: String!
      password: String!
      first_name: String!
      last_name: String!
      email_optin: Boolean!
    ): AuthPayload!

    # Verification Code Mutations
    verifyEmail(code_value: Int!): User!
  }
`
export const resolvers = {
  Query: {
    me,
  },
  Mutation: {
    registerUser,
    loginUser,
    verifyEmail,
  },
}
