import { useState } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { PATH } from "../constants"
import {
  useLoginUserMutation,
  useMyInfoQuery,
  useRegisterUserMutation,
} from "../generated/graphql"
import { useAuthUser } from "../auth/useAuthUser"
import { bind } from "../tools"
import { Box, Typography, Avatar, TextField, Button, Grid } from "@mui/material"
import { styled } from "@mui/system"
import { Page } from "../components/Page"
import { useSnackbar } from "notistack"

const MuiLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
}))

export function LoginOrRegister() {
  const { setAuthUser } = useAuthUser()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [emailError, setEmailError] = useState(false)
  const [passError, setPassError] = useState(false)

  const location = useLocation()
  const isLogin = location.pathname.includes(PATH.LOGIN)
  const isRegister = location.pathname.includes(PATH.REGISTER)

  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const redirectFullUrl = redirectUrl ? "/?redirect=" + redirectUrl : ""

  const { data } = useMyInfoQuery()

  const onCompleted = (data: any) => {
    const { token } = data.register || data.login
    if (!token)
      return enqueueSnackbar("Something went wrong.", { variant: "error" })

    setAuthUser(token)
  }

  const [register] = useRegisterUserMutation({
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" })
      // if message includes "email"
      // remove password fields
      if (err.message.includes("email")) {
        setEmailError(true)
        setPassword("")
      }
      // highlight email field
    },
    onCompleted,
  })

  const [login] = useLoginUserMutation({
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
    onCompleted,
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
        },
      })
  }

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
          {isLogin ? "Login" : "Register"}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isRegister ? "Register" : isLogin ? "Login" : "Submit"}
          </Button>
          <Grid container>
            <Grid item xs>
              <MuiLink to={PATH.FORGOT_PASS + redirectFullUrl}>
                Forgot password?
              </MuiLink>
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
