import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "./auth/ProtectedRoute"
import { PATH } from "./constants"
import { LoginOrRegister } from "./routes/LoginOrRegister"
import { Home } from "./routes/Home"
import { Profile } from "./routes/Profile"
import { Settings } from "./routes/Settings"
import { VerifyEmail } from "./routes/VerifyEmail"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATH.HOME} element={<Home />} />
        {[PATH.LOGIN, PATH.REGISTER].map((path) => (
          <Route key={path} path={path} element={<LoginOrRegister />} />
        ))}
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
        <Route
          path={PATH.VERIFY_EMAIL}
          element={
            <ProtectedRoute>
              <VerifyEmail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={PATH.HOME} />} />
      </Routes>
    </BrowserRouter>
  )
}
