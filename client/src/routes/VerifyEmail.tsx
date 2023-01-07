import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import { Page } from "../components/Page"
import { useMyInfoQuery, useVerifyEmailMutation } from "../generated/graphql"
import { useSnackbar } from "notistack"
import { bind } from "../tools"
import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { PATH } from "../constants"

export const VerifyEmail = () => {
  const { enqueueSnackbar } = useSnackbar()

  const navigate = useNavigate()

  // Redirect url
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const redirectFullUrl = redirectUrl ? "/?redirect=" + redirectUrl : ""

  const [code, setCode] = useState("")

  const { data } = useMyInfoQuery()

  const [verifyEmail] = useVerifyEmailMutation({
    onError: (err) => {
      console.log(err)
    },
    onCompleted: (data) => {
      console.log(data)
      enqueueSnackbar("Email verified!", { variant: "success" })
      setTimeout(() => {
        navigate(redirectFullUrl || PATH.PROFILE)
      }, 1000)
    },
  })

  const handleVerify = () => {
    console.log(parseInt(code))
    if (!code || code.length !== 6) {
      enqueueSnackbar("Invalid code", { variant: "error" })
      return
    }

    verifyEmail({
      variables: {
        code_value: parseInt(code),
      },
    })
  }

  if (!data?.me) return null

  return (
    <Page hideNav>
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 10,
              pb: 10,
            }}
          >
            <Typography variant="h4" component="h1">
              Verify your email address
            </Typography>
            <Typography
              variant="body1"
              component="p"
              sx={{
                span: {
                  color: "primary.main",
                },
              }}
            >
              A 6-digit code has been sent to your email address:{" "}
              <span>{data?.me.email}.</span>
            </Typography>
            <Box
              sx={{
                margin: 5,
                display: "flex",
                gap: 2,
              }}
            >
              <TextField
                required
                type="text"
                name="code"
                placeholder="Code"
                label="Code"
                id="code"
                {...bind([code, setCode])}
              />
              <Button variant="contained" onClick={handleVerify}>
                Verify
              </Button>
            </Box>
            <Typography variant="body1" component="p">
              Didnt receive a code? <a href="#">Resend</a>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Page>
  )
}
