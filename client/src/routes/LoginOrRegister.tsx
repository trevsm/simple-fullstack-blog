import { useState } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import { PATH } from "../constants"
import { useErrorResolver } from "../errors/useErrorResolver"
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

const MuiLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
}))

export function LoginOrRegister() {
  const { setAuthUser } = useAuthUser()

  const location = useLocation()

  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const redirectFullUrl = redirectUrl ? "/?redirect=" + redirectUrl : ""

  const { data } = useMyInfoQuery({
    onError: useErrorResolver,
  })

  const onCompleted = (data: any) => {
    const { token } = data.register || data.login
    if (!token) alert("Something went wrong")

    setAuthUser(token)
  }

  const [register] = useRegisterUserMutation({
    onError: useErrorResolver,
    onCompleted,
  })

  const [login] = useLoginUserMutation({
    onError: useErrorResolver,
    onCompleted,
  })

  const isLogin = location.pathname.includes(PATH.LOGIN)
  const isRegister = location.pathname.includes(PATH.REGISTER)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

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
        {data?.me && (
          <>
            <p> Hello, {data.me.email} </p>
            <p> Use a different account? </p>
          </>
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
            margin="normal"
            required
            fullWidth
            autoComplete="email"
            type="email"
            name="email"
            placeholder="email"
            label="Email"
            id="email"
            {...bind([email, setEmail])}
          />
          <TextField
            margin="dense"
            required
            fullWidth
            type="password"
            name="password"
            label="Password"
            placeholder="password"
            id="password"
            autoComplete="current-password"
            {...bind([password, setPassword])}
          />
          {isRegister && (
            <TextField
              margin="dense"
              required
              fullWidth
              type="password"
              name="password"
              label="Password"
              placeholder="password"
              id="password"
              autoComplete="current-password"
              {...bind([password2, setPassword2])}
            />
          )}
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
