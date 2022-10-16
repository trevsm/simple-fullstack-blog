import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import Auth from "./auth/Auth"

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <ApolloProvider {...{ client }}>
      <Auth>
        <App />
      </Auth>
    </ApolloProvider>
  </React.StrictMode>
)
