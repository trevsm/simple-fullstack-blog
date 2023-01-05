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
import { CssBaseline, ThemeProvider } from "@mui/material"
import { theme } from "./theme"
import { SnackbarProvider } from "notistack"

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
)
