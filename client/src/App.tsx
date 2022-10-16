import useAuthUser from "./auth/hooks/useAuthUser"
import { useMyInfoQuery } from "./generated/graphql"

function App() {
  const { logout } = useAuthUser()
  const { data } = useMyInfoQuery()

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <div className="App">Welcome {data?.me?.email}</div>
    </div>
  )
}

export default App
