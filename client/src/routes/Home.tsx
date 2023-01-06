import { Box, Grid, Typography } from "@mui/material"
import { Page } from "../components/Page"

export const Home = () => {
  return (
    <Page>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            bgcolor: "#f0f0f0",
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              pt: 10,
              pb: 10,
            }}
          >
            <Typography variant="h4" component="h1">
              Welcome to Company
            </Typography>
            <Typography variant="body1" component="p">
              This is a demo full-stack app built with React, Node, GraphQL, and
              MySQL.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Page>
  )
}
