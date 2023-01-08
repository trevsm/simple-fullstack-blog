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
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { bind } from "../tools"
import { useSnackbar } from "notistack"
import { green, orange } from "@mui/material/colors"
import { Visibility, VisibilityOff } from "@mui/icons-material"

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

  const firstNameState = useState("")
  const lastNameState = useState("")
  const emailState = useState("")
  const [optin, setOptin] = useState(false)

  const [password, setPassword] = useState("")
  const [visiblePassword, setVisiblePassword] = useState(false)

  const [updateUser, { loading: updateLoading }] = useUpdateUserMutation({
    onError: (error) => {
      // reset all fields
      firstNameState[1](data?.me?.first_name || "")
      lastNameState[1](data?.me?.last_name || "")
      emailState[1](data?.me?.email || "")
      setOptin(data?.me?.email_optin || false)

      enqueueSnackbar(error.message, { variant: "error" })
    },
    onCompleted: (data) => {
      enqueueSnackbar("Profile updated!", { variant: "success" })
      refetch()
    },
  })

  const loading = dataLoading || updateLoading

  const hasChanged: boolean =
    firstNameState[0] !== data?.me?.first_name ||
    lastNameState[0] !== data?.me?.last_name ||
    emailState[0] !== data?.me?.email ||
    optin !== data?.me?.email_optin ||
    password !== ""

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (data?.me) {
      const { first_name, last_name, email, email_optin } = data.me
      firstNameState[1](first_name)
      lastNameState[1](last_name)
      emailState[1](email)
      setOptin(email_optin)
      setPassword("")
    }
  }, [data])

  const handleUpdateUser = () => {
    // as long as the user has changed something, we'll update the user
    if (!hasChanged || !data?.me) return

    const { first_name, last_name, email, email_optin } = data.me

    const fName =
      firstNameState[0] === first_name ? undefined : firstNameState[0]
    const lName = lastNameState[0] === last_name ? undefined : lastNameState[0]
    const eMail = emailState[0] === email ? undefined : emailState[0]
    const eOptin = optin === email_optin ? undefined : optin
    const pWord = password === "" ? undefined : password

    updateUser({
      variables: {
        first_name: fName,
        last_name: lName,
        email: eMail,
        email_optin: eOptin,
        newPassword: pWord,
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
        <Typography
          variant="subtitle2"
          sx={{
            width: "fit-content",
            marginTop: "5px",
          }}
        >
          <Box
            sx={{
              display: data?.me ? "inline-block" : "none",
              padding: "2px 5px 0 5px",
              borderRadius: "5px",
              backgroundColor: data?.me?.email_verified
                ? green[500]
                : orange[500],
              border: "1px solid",
              borderColor: data?.me?.email_verified ? green[700] : orange[700],
            }}
            color="white"
          >
            {/* @TODO: add a tool tip about what it means to be unverified */}
            {data?.me
              ? data.me.email_verified
                ? "Verified"
                : "Unverified"
              : ""}
          </Box>
          {/* @TODO: Add "Verify Email" button */}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        component="h2"
        sx={{ my: 2, textDecoration: "underline" }}
      >
        Password
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          label="New Password"
          margin="dense"
          size="small"
          type={visiblePassword ? "text" : "password"}
          required
          {...bind([password, setPassword])}
        />
        <IconButton
          onClick={() => setVisiblePassword(!visiblePassword)}
          sx={{ alignSelf: "flex-end" }}
        >
          {visiblePassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
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
