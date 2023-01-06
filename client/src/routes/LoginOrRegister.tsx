import { useEffect, useState } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { PATH } from "../constants"
import {
  useLoginMutation,
  useMyInfoQuery,
  useRegisterMutation,
} from "../generated/graphql"
import { useAuthUser } from "../auth/useAuthUser"
import { bind } from "../tools"
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import { styled } from "@mui/system"
import { Page } from "../components/Page"
import { useSnackbar } from "notistack"

const MuiLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
}))

export function LoginOrRegister() {
  // Auth & snackbar
  const { setAuthUser } = useAuthUser()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [email_optin, setEmailOptin] = useState(false)

  // Form errors
  const [emailError, setEmailError] = useState(false)
  const [passError, setPassError] = useState(false)

  // Route info
  const location = useLocation()
  const isLogin = location.pathname.includes(PATH.LOGIN)
  const isRegister = location.pathname.includes(PATH.REGISTER)

  // Redirect url
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const redirectFullUrl = redirectUrl ? "/?redirect=" + redirectUrl : ""

  const { data } = useMyInfoQuery()

  const [register] = useRegisterMutation({
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" })
      if (err.message.includes("email")) {
        setEmailError(true)
        setPassword("")
      }
    },
    onCompleted: (res) => {
      const { token } = res.registerUser
      setAuthUser(token)
    },
  })

  const [login] = useLoginMutation({
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" })
      if (err.message.includes("email")) {
        setEmailError(true)
        setPassword("")
      } else if (err.message.includes("password")) {
        setPassError(true)
        setPassword("")
      }
    },
    onCompleted: (res) => {
      const { token } = res.loginUser
      setAuthUser(token)
    },
  })

  const handleSubmit = async () => {
    if (isLogin)
      login({
        variables: {
          email,
          password,
        },
      })
    else if (isRegister)
      register({
        variables: {
          email,
          password,
          first_name,
          last_name,
          email_optin,
        },
      })
  }

  useEffect(() => {
    // clear all fields on route change
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setEmailOptin(false)

    // clear all errors
    setEmailError(false)
    setPassError(false)
  }, [isLogin, isRegister])

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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography variant="h4" component="h1" gutterBottom>
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        {data?.me && isLogin && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                span: {
                  color: "primary.main",
                },
              }}
            >
              Hello, <span>{data.me.email}</span>. Use a different account?
            </Typography>
          </Box>
        )}
        <Box
          maxWidth={500}
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          {isRegister && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <TextField
                required
                type="First"
                name="first"
                placeholder="First"
                label="First"
                id="first"
                sx={{
                  width: "50%",
                }}
                {...bind([first_name, setFirstName])}
              />
              <TextField
                required
                type="Last"
                name="last"
                placeholder="Last"
                label="Last"
                id="last"
                sx={{
                  width: "50%",
                }}
                {...bind([last_name, setLastName])}
              />
            </Box>
          )}
          <TextField
            error={emailError}
            margin="normal"
            required
            fullWidth
            autoComplete="email"
            type="email"
            name="email"
            placeholder="email"
            label="Email"
            id="email"
            {...bind([email, setEmail], () => {
              if (emailError) {
                setEmailError(false)
                closeSnackbar()
              }
            })}
          />
          <TextField
            error={passError}
            margin="dense"
            required
            fullWidth
            type="password"
            name="password"
            label="Password"
            placeholder="password"
            id="password"
            autoComplete="current-password"
            {...bind([password, setPassword], () => {
              if (passError) {
                setPassError(false)
                closeSnackbar()
              }
            })}
          />
          {isRegister && (
            <Box
              sx={{
                pt: 2,
                pl: 2,
              }}
            >
              <FormControlLabel
                labelPlacement="end"
                label="I want to receive inspiration, marketing promotions and updates via email."
                control={<Checkbox />}
              />
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isRegister ? "Sign Up" : isLogin ? "Login" : "Submit"}
          </Button>
          <Grid container>
            <Grid item xs>
              {isLogin && (
                <MuiLink to={PATH.FORGOT_PASS + redirectFullUrl}>
                  Forgot password?
                </MuiLink>
              )}
            </Grid>
            <Grid item>
              {isLogin ? (
                <MuiLink to={PATH.REGISTER + redirectFullUrl}>
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              ) : (
                <MuiLink to={PATH.LOGIN + redirectFullUrl}>
                  {"Already have an account? Login"}
                </MuiLink>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Page>
  )
}
