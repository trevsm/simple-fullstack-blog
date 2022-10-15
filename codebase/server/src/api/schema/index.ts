import { gql } from "apollo-server-express"
import {
  user,
  allUsers,
  registerUser,
  login,
  updateUser,
  deleteUser,
} from "./user"
import { createPost, updatePost, deletePost } from "./post"

export const typeDefs = gql`
  type User {
    user_id: Int!
    email: String!
  }

  type Post {
    id: Int!
    user_id: Int!
    title: String!
    content: String!
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
    user(id: Int!): User
    allUsers: [User!]!

    # Post queries
    post(id: ID!): Post
    allUserPosts(user_id: ID!): [Post]
    allPosts: [Post]
  }

  type Mutation {
    # User Mutations
    login(email: String!, password: String!): AuthPayload!
    registerUser(email: String!, password: String!): AuthPayload!

    updateUser(id: ID!, email: String, password: String): User
    deleteUser(id: ID!): String

    # Post Mutations
    createPost(user_id: ID!, title: String!, content: String!): Post
    updatePost(id: ID!, user_id: ID!, title: String!, content: String!): Post
    deletePost(id: ID!): String
  }
`
export const resolvers = {
  Query: {
    user,
    allUsers,
  },
  Mutation: {
    login,
    registerUser,
    updateUser,
    deleteUser,

    createPost,
    updatePost,
    deletePost,
  },
}
