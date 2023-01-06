import { Box, Button, Divider, Menu, MenuItem } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import { PATH } from "../constants"
import MailIcon from "@mui/icons-material/Mail"
import { useAuthUser } from "../auth/useAuthUser"

export function AvatarMenu({ name, email }: { name: string; email: string }) {
  const { logout } = useAuthUser()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {name}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>
          <MailIcon
            sx={{
              mr: 1,
            }}
          />{" "}
          {email}
        </MenuItem>
        <Divider />
        <Link to={PATH.PROFILE}>
          <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        </Link>
        <Link to={PATH.PROFILE}>
          <MenuItem onClick={handleClose}>Edit Profile</MenuItem>
        </Link>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </Box>
  )
}
