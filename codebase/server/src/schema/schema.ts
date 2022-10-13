import { gql } from 'apollo-server-express'
import db from '../database'
import Crypt from 'crypto-js'

export const typeDefs = gql`
  type user {
    user_id: Int!
    email: String!
    password: String!
  }

  type post {
    id: Int!
    user_id: Int!
    title: String!
    content: String!
  }

  type Query {
    # User queries
    user(email: String!): user
    allUsers: [user]

    # Post queries
    post(id: ID!): post
    allUserPosts(user_id: ID!): [post]
    allPosts: [post]
  }

  type Mutation {
    # User Mutations
    createUser(email: String!, password: String!): user
    updateUser(id: ID!, email: String!, password: String!): user
    deleteUser(id: ID!): String!

    # Post Mutations
    createPost(user_id: ID!, title: String!, content: String!): post
    updatePost(id: ID!, user_id: ID!, title: String!, content: String!): post
    deletePost(id: ID!): String!
  }
`
export const resolvers = {
  Query: {
    user: async (_: any, { email }: any) => {
      const user = await db.user.findOne({ where: { email } })
      if (!user) return null

      return {
        user_id: user.getDataValue('user_id'),
        email: user.getDataValue('email'),
        password: user.getDataValue('password'),
      }
    },
    allUsers: async () => {
      const users = await db.user.findAll()
      if (!users) return null

      return users.map((user) => ({
        user_id: user.getDataValue('user_id'),
        email: user.getDataValue('email'),
      }))
    },
  },
  Mutation: {
    // User Mutations
    createUser: async (_: any, { email, password }: any) => {
      const hash = Crypt.SHA512(password + process.env.SECRET).toString()
      const data = await db.user.create({ email, password: hash })
      return {
        email: data.getDataValue('email'),
        password: data.getDataValue('password'),
      }
    },
    // @TODO: Update only the fields that are passed instead of all of them
    updateUser: async (_: any, { id, email, password }: any) => {
      const hash = Crypt.SHA512(password + process.env.SECRET).toString()
      await db.user.update(
        { email, password: hash },
        { where: { user_id: id } },
      )
      const newUser = await db.user.findOne({ where: { user_id: id } })
      return newUser
    },
    deleteUser: async (_: any, { id }: any) => {
      await db.user.destroy({ where: { user_id: id } })
      return 'User deleted'
    },

    // Post Mutations
    createPost: async (_: any, { user_id, title, content }: any) => {
      const data = await db.post.create({ user_id, title, content })
      return {
        id: data.id,
        user_id: data.getDataValue('user_id'),
        title: data.getDataValue('title'),
        content: data.getDataValue('content'),
      }
    },
    // @TODO: Update only the fields that are passed instead of all of them
    updatePost: async (_: any, { id, user_id, title, content }: any) => {
      await db.post.update({ user_id, title, content }, { where: { id } })
      const newPost = await db.post.findOne({ where: { id } })
      return newPost
    },
    deletePost: async (_: any, { id }: any) => {
      await db.post.destroy({ where: { id } })
      return 'Post deleted'
    },
  },
}
