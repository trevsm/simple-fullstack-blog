import { Box, Container } from "@mui/material"
import Navbar from "./Navbar"

export const Page = ({
  hideNav,
  children,
}: {
  hideNav?: boolean
  children: React.ReactNode
}) => {
  return (
    <>
      <Navbar hideNav={hideNav} />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>{children}</Box>
      </Container>
    </>
  )
}
