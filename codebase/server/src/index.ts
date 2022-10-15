import { ApolloServer } from "apollo-server-express"
import { resolvers, typeDefs } from "./api/schema"
import * as dotenv from "dotenv"

dotenv.config()

import express from "express"

const PORT = process.env.NODE_PORT || 3030
const app = express()

const graphql = async () => {
  const server = new ApolloServer({ resolvers, typeDefs })

  await server.start()

  server.applyMiddleware({ app })
}
graphql()

app.get("/", async (req, res) => {
  res.send("Hello World")
})

app.listen(PORT, () => {
  if (process.env.NODE_PORT) {
    console.log(`Server running ENV port: ${PORT}`)
  } else {
    console.log(`Running on DEFAULT port: ${PORT}`)
  }
})
