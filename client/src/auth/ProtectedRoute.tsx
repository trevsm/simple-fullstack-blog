import { useNavigate } from "react-router-dom"
import { useMyInfoQuery } from "../generated/graphql"

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { data, loading } = useMyInfoQuery()
  const navigate = useNavigate()

  const path = window.location.pathname

  if (loading) return <div>Loading...</div>
  if (data) return <div className="App">{children}</div>

  return (
    <div>
      <p>Please login to access {path}</p>
      <button
        onClick={() => {
          navigate("/login" + "?redirect=" + path)
        }}
      >
        login
      </button>
    </div>
  )
}
