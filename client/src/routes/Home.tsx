import { Link } from "react-router-dom"
import { PATH } from "../constants"
import { Page } from "../components/Page"

export const Home = () => {
  return (
    <Page>
      <p>Welcome to my website!</p>
      <Link to={PATH.PROFILE}>Go to profile</Link>
      <br />
      <Link to={PATH.SETTINGS}>Go to settings</Link>
    </Page>
  )
}
