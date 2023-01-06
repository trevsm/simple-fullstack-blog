import { useMyInfoQuery } from "../generated/graphql"
import { Page } from "../components/Page"

export const Profile = () => {
  const { data } = useMyInfoQuery()

  if (!data?.me)
    return (
      <Page>
        <p>Unauthorized</p>
        <p>
          If you are logged in, you may need to refresh the page to see your
          profile.
        </p>
      </Page>
    )

  const { first_name } = data.me

  return (
    <Page>
      <p>Profile</p>
      <p>Hello {first_name}!</p>
    </Page>
  )
}
