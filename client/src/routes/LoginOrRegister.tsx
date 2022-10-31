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
    <div>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      {data && data.me && (
        <>
          <p> Hello, {data.me.email} </p>
          <p> Use a different account? </p>
        </>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <input type="email" placeholder="email" {...bind([email, setEmail])} />
        <input
          type="password"
          placeholder="password"
          {...bind([password, setPassword])}
        />
        {isRegister && (
          <input
            type="password"
            placeholder="password"
            {...bind([password2, setPassword2])}
          />
        )}
        <button type="submit">
          {isRegister ? "Register" : isLogin ? "Login" : "Submit"}
        </button>
        <br />
        {isLogin ? (
          <Link to={PATH.REGISTER + redirectFullUrl}>go to register</Link>
        ) : (
          <Link to={PATH.LOGIN + redirectFullUrl}>go to login</Link>
        )}
      </form>
    </div>
  )
}
