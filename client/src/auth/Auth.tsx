import { useState } from "react"
import { useMyInfoQuery } from "../generated/graphql"

import { Login } from "./Login"
import { Register } from "./Register"

export function LoginOrRegister() {
  const [register, setRegister] = useState(false)
  return (
    <div>
      <button onClick={() => setRegister(!register)}>
        {register ? "Goto Login" : "Goto Register"}
      </button>
      {register ? <Register /> : <Login />}
    </div>
  )
}

export default function Auth({ children }: { children: JSX.Element }) {
  const { data, loading } = useMyInfoQuery()

  if (loading) return <div>Loading...</div>

  if (!data) return <LoginOrRegister />

  return <div className="App">{children}</div>
}
