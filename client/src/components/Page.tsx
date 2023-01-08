import { Box, Container } from "@mui/material"
import Navbar from "./Navbar"
import Loader from "./Loader"

export const Page = ({
  hideNav,
  globalLoading,
  children,
}: {
  hideNav?: boolean
  globalLoading?: boolean
  children: React.ReactNode
}) => {
  return (
    <Box>
      <Navbar hideNav={hideNav} />
      <Container maxWidth="xl">
        <Box sx={{ my: 4, mx: 1, position: "relative" }}>
          {globalLoading && <Loader />}
          {globalLoading ? (
            <Box sx={{ opacity: 0.5, pointerEvents: "none" }}>{children}</Box>
          ) : (
            children
          )}
        </Box>
      </Container>
    </Box>
  )
}
