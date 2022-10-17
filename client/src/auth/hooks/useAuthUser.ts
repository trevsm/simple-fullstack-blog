// import { useApolloClient } from "@apollo/react-hooks"

const useAuthUser = () => {
  // const client = useApolloClient()

  const setAuthUser = (token: string) => {
    localStorage.setItem("token", token)
    window.location.reload()
  }

  const logout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return { logout, setAuthUser }
}

export default useAuthUser
