import { Link } from "react-router-dom"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "./auth/ProtectedRoute"
import { useAuthUser } from "./auth/useAuthUser"
import { PATH } from "./constants"
import { useMyInfoQuery } from "./generated/graphql"
import { LoginOrRegister } from "./routes/LoginOrRegister"

const Home = () => {
  const { logout } = useAuthUser()
  return (
    <div>
      <button onClick={logout}>logout</button>
      <p>Welcome to my website!</p>
      <Link to={PATH.PROFILE}>Go to profile</Link>
      <br />
      <Link to={PATH.SETTINGS}>Go to settings</Link>
    </div>
  )
}

const Profile = () => {
  const { data } = useMyInfoQuery()
  return (
    <div>
      <p>Profile</p>
      <p>Hello {data?.me?.email}</p>
    </div>
  )
}

const Settings = () => {
  return (
    <div>
      <p>Settings</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATH.HOME} element={<Home />} />
        <Route path={PATH.LOGIN} element={<LoginOrRegister />} />
        <Route path={PATH.REGISTER} element={<LoginOrRegister />} />
        <Route
          path={PATH.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATH.SETTINGS}
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={PATH.HOME} />} />
      </Routes>
    </BrowserRouter>
  )
}
