import { gql } from "apollo-server-express"
import {
  me,
  user,
  allUsers,
  registerUser,
  login,
  updateUser,
  deleteUser,
} from "./user"
import {
  createPost,
  updatePost,
  deletePost,
  allPosts,
  allUserPosts,
} from "./post"

export const typeDefs = gql`
  type User {
    id: Int!
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
    post(id: Int!): Post
    allUserPosts(id: Int!): [Post]
    allPosts: [Post]
  }

  type Mutation {
    # User Mutations
    login(email: String!, password: String!): AuthPayload!
    registerUser(email: String!, password: String!): AuthPayload!

    updateUser(id: Int!, email: String, password: String): User
    deleteUser(id: Int!): String

    # Post Mutations
    createPost(title: String!, content: String!): Post
    updatePost(id: Int!, title: String!, content: String!): Post
    deletePost(id: Int!): String
  }
`
export const resolvers = {
  Query: {
    me,
    user,
    allUsers,

    allPosts,
    allUserPosts,
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
