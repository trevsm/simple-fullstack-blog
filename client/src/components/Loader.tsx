import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

export default function Loader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "0",
        height: "200px",
        left: "0",
        width: "100%",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <CircularProgress />
    </Box>
  )
}
