import { Navigate } from "react-router-dom"
import { useMyInfoQuery } from "../generated/graphql"

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { data, loading } = useMyInfoQuery()

  const path = window.location.pathname

  if (loading) return <div>Loading...</div>
  if (!data) return <Navigate to={"/login" + "?redirect=" + path} />

  return <div className="App">{children}</div>
}
