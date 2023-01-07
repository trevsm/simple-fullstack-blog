import { PATH } from "../constants"

export const useAuthUser = () => {
  const setAuthUser = (token: string, verifyEmail?: boolean) => {
    const searchParams = new URLSearchParams(window.location.search)
    const redirect = searchParams.get("redirect") || PATH.PROFILE

    localStorage.setItem("token", token)
    if (verifyEmail) {
      window.location.href = PATH.VERIFY_EMAIL
    } else {
      window.location.href = redirect
    }
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = PATH.LOGIN
  }

  return { logout, setAuthUser }
}
