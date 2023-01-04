import { useMyInfoQuery } from "../generated/graphql"
import { Page } from "../components/Page"

export const Profile = () => {
  const { data } = useMyInfoQuery()
  return (
    <Page>
      <p>Profile</p>
      <p>Hello {data?.me?.email}</p>
    </Page>
  )
}
