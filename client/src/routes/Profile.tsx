import { useMyInfoQuery } from "../generated/graphql"
import { Page } from "../components/Page"
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"

export const Profile = () => {
  const { data } = useMyInfoQuery()

  if (!data?.me)
    return (
      <Page>
        <p>Unauthorized</p>
        <p>
          If you are logged in, you may need to refresh the page to see your
          profile.
        </p>
      </Page>
    )

  const { first_name, last_name, email_optin, email_verified } = data.me

  return (
    <Page>
      <Typography variant="h4" component="h1">
        Profile
      </Typography>
      <Typography
        variant="h6"
        component="h2"
        sx={{ my: 2, textDecoration: "underline" }}
      >
        Name
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          label="First"
          value={first_name}
          margin="dense"
          size="small"
        />
        <TextField label="Last" value={last_name} margin="dense" size="small" />
      </Box>
      <Typography
        variant="h6"
        component="h2"
        sx={{ my: 2, textDecoration: "underline" }}
      >
        Email
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
        }}
      >
        <TextField
          label="Email"
          value={data.me.email}
          margin="dense"
          size="small"
        />
        {!email_verified ? (
          <Typography variant="subtitle2" color="warning.main">
            Unverified
          </Typography>
        ) : (
          <Typography variant="subtitle2" color="success.main">
            Verified
          </Typography>
        )}
      </Box>

      <Typography
        variant="h6"
        component="h2"
        sx={{ my: 2, textDecoration: "underline" }}
      >
        Email Subscription
      </Typography>
      <Box
        sx={{
          mb: 5,
        }}
      >
        <FormControlLabel
          labelPlacement="end"
          label="I want to receive inspiration, marketing promotions and updates via email."
          control={<Checkbox checked={email_optin} />}
        />
      </Box>
      <Button variant="contained" sx={{ mt: 2 }}>
        Save
      </Button>
    </Page>
  )
}
