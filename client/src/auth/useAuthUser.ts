import { PATH } from "../constants"

export const useAuthUser = () => {
  const setAuthUser = (token: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    const redirect = searchParams.get("redirect") || PATH.PROFILE

    localStorage.setItem("token", token)
    window.location.href = redirect
  }

  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return { logout, setAuthUser }
}
