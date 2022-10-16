import { useState } from "react"
import { useRegisterUserMutation } from "../generated/graphql"
import useAuthUser from "./hooks/useAuthUser"

export const Register = () => {
  const [registerUser] = useRegisterUserMutation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const { setAuthUser } = useAuthUser()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== password2) {
      alert("Passwords do not match")
      return
    }

    const { data, errors } = await registerUser({
      variables: {
        email,
        password,
      },
    })
    console.log(errors)

    if (data) setAuthUser(data.registerUser.token)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  )
}
