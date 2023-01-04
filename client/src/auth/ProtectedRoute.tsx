import { useNavigate } from "react-router-dom"
import { useMyInfoQuery } from "../generated/graphql"
import { Box, Button, Typography } from "@mui/material"
import { Page } from "../components/Page"

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { data } = useMyInfoQuery()
  const navigate = useNavigate()

  const path = window.location.pathname

  if (data) return children

  return (
    <Page hideNav>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="h6" gutterBottom>
          You must be logged-in to access <b>{path}</b>
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/login" + "?redirect=" + path)
          }}
        >
          login
        </Button>
      </Box>
    </Page>
  )
}
