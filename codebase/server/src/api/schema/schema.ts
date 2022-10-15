import { gql } from "apollo-server-express"
import { user, allUsers, createUser, updateUser, deleteUser } from "./user"
import { createPost, updatePost, deletePost } from "./post"

export const typeDefs = gql`
  type private_user {
    user_id: Int!
    email: String!
    password: String!
  }

  type public_user {
    email: String!
  }

  type post {
    id: Int!
    user_id: Int!
    title: String!
    content: String!
  }

  type Error {
    error: String!
  }

  type Query {
    # User queries
    user(email: String!): private_user
    allUsers: [public_user]

    # Post queries
    post(id: ID!): post
    allUserPosts(user_id: ID!): [post]
    allPosts: [post]
  }

  type Mutation {
    # User Mutations
    createUser(email: String!, password: String!): public_user
    updateUser(id: ID!, email: String, password: String): public_user
    deleteUser(id: ID!): String!

    # Post Mutations
    createPost(user_id: ID!, title: String!, content: String!): post
    updatePost(id: ID!, user_id: ID!, title: String!, content: String!): post
    deletePost(id: ID!): String!
  }
`
export const resolvers = {
  Query: {
    user,
    allUsers,
  },
  Mutation: {
    createUser,
    updateUser,
    deleteUser,

    createPost,
    updatePost,
    deletePost,
  },
}
