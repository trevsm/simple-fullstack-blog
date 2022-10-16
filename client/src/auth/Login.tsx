import { useState } from "react"
import { useLoginUserMutation } from "../generated/graphql"
import useAuthUser from "./hooks/useAuthUser"

export const Login = () => {
  const [login] = useLoginUserMutation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setAuthUser } = useAuthUser()

  const handleLogin = async () => {
    const { data } = await login({
      variables: {
        email,
        password,
      },
    })
    if (data) setAuthUser(data.login.token)
  }
  return (
    <div>
      <input
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
