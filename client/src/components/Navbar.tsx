import { AppBar, Box, Button, Toolbar, Container } from "@mui/material"

import { PATH } from "../constants"
import { Link } from "react-router-dom"

export default function Navbar({ hideNav }: { hideNav?: boolean }) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        color: "text.primary",
        pt: 1,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          style={{
            padding: "0",
          }}
          sx={{
            justifyContent: "space-between",
            a: {
              textDecoration: "none",
              color: "inherit",
              button: {
                textTransform: "none",
                fontWeight: "bold",
              },
            },
          }}
        >
          <Box
            sx={{
              color: "primary.main",
            }}
          >
            <Link to={PATH.HOME}>
              <Button color="inherit">Company</Button>
            </Link>
          </Box>
          {!hideNav && (
            <Box
              sx={{
                color: "text.primary",
              }}
            >
              <Link to={PATH.HOME}>
                <Button color="inherit">Home</Button>
              </Link>
              <Link to={PATH.HOME}>
                <Button color="inherit">About</Button>
              </Link>
              <Link to={PATH.HOME}>
                <Button color="inherit">Store</Button>
              </Link>
              <Link to={PATH.HOME}>
                <Button color="inherit">Contact</Button>
              </Link>
            </Box>
          )}
          <Box
            sx={{
              color: "primary.main",
            }}
          >
            <Link to={PATH.LOGIN}>
              <Button color="inherit">Login</Button>
            </Link>
            <Link to={PATH.REGISTER}>
              <Button color="inherit">Sign Up</Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
