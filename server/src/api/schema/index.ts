import { gql } from "apollo-server-express"
import { me, registerUser, loginUser } from "./User"

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
    user(user_id: Int!): User
    allUsers: [User!]!
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
  }
`
export const resolvers = {
  Query: {
    me,
  },
  Mutation: {
    registerUser,
    loginUser,
  },
}
