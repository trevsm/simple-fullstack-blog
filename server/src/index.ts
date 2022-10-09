import { ApolloServer } from 'apollo-server-express'
import { resolvers, typeDefs } from './schema/schema'

import express from 'express'

const PORT = 4000
const app = express()

const graphql = async () => {
  const server = new ApolloServer({ resolvers, typeDefs })

  await server.start()

  server.applyMiddleware({ app })
}
graphql()

app.get('/', async (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`)
})
