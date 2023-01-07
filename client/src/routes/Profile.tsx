import {
  MyInfoQuery,
  useMyInfoLazyQuery,
  useUpdateUserMutation,
} from "../generated/graphql"
import { Page } from "../components/Page"
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { bind } from "../tools"
import { useSnackbar } from "notistack"

export const Profile = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = useState<MyInfoQuery>()
  const [getUser, { loading: dataLoading, refetch }] = useMyInfoLazyQuery({
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" })
    },
    onCompleted: (data) => {
      setData(data)
    },
  })

  const [updateUser, { loading: updateLoading }] = useUpdateUserMutation({
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" })
    },
    onCompleted: (data) => {
      enqueueSnackbar("Profile updated!", { variant: "success" })
      refetch()
    },
  })

  const loading = dataLoading || updateLoading

  const { first_name, last_name, email, email_optin, email_verified } = data?.me
    ? data.me
    : {
        first_name: "",
        last_name: "",
        email: "",
        email_optin: false,
        email_verified: false,
      }

  const firstNameState = useState("")
  const lastNameState = useState("")
  const emailState = useState("")
  const [optin, setOptin] = useState(false)

  const hasChanged: boolean =
    firstNameState[0] !== first_name ||
    lastNameState[0] !== last_name ||
    emailState[0] !== email ||
    optin !== email_optin

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (data) {
      firstNameState[1](first_name)
      lastNameState[1](last_name)
      emailState[1](email)
      setOptin(email_optin)
    }
  }, [data])

  const handleUpdateUser = () => {
    // as long as the user has changed something, we'll update the user
    if (!hasChanged) return

    const fName =
      firstNameState[0] === first_name ? undefined : firstNameState[0]
    const lName = lastNameState[0] === last_name ? undefined : lastNameState[0]
    const eMail = emailState[0] === email ? undefined : emailState[0]
    const eOptin = optin === email_optin ? undefined : optin

    updateUser({
      variables: {
        first_name: fName,
        last_name: lName,
        email: eMail,
        email_optin: eOptin,
      },
    })
  }

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
          margin="dense"
          size="small"
          required
          {...bind(firstNameState)}
        />
        <TextField
          label="Last"
          margin="dense"
          size="small"
          required
          {...bind(lastNameState)}
        />
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
          margin="dense"
          size="small"
          required
          {...bind(emailState)}
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
          control={
            <Checkbox
              checked={optin}
              onChange={(e) => setOptin(e.target.checked)}
            />
          }
        />
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleUpdateUser}
        disabled={loading || !hasChanged}
      >
        Save
      </Button>
    </Page>
  )
}
