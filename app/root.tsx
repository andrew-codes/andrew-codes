import { Outlet } from "@remix-run/react"
import type { FC } from "react"
import styled from "styled-components"
import ApplicationShell from "./components/ApplicationShell"
import { Header } from "./components/Category"
import Link from "./components/Link"
import PageWithHeader from "./components/PageWithHeader"
import { Blockquote, Paragraph } from "./components/Post"

const App: FC<{}> = () => (
  <ApplicationShell>
    <Outlet />
  </ApplicationShell>
)

const Page = styled(PageWithHeader)`
  section {
    padding: 0 1.5rem 1.5rem;

    @media (max-width: 640px) {
      margin: 0 0.5rem;
    }

    > ${Paragraph} {
      margin-bottom: 1.125rem;
    }
  }
`

const ErrorBoundary: FC<{}> = () => (
  <ApplicationShell>
    <Page>
      <Header category={null}>
        <h1>Oops...</h1>
      </Header>
      <section>
        <Paragraph>
          Well that's embarrassing! There's been an error, but don't worry, you
          can use the main navigation to head back to the homepage.
        </Paragraph>
        <Blockquote>
          If you feel you're seeing this message in error, please feel free to
          contact me or open a{" "}
          <Link to="https://github.com/andrew-codes/andrew-codes/issues/new">
            GitHub issue
          </Link>
          . No pressure though!
        </Blockquote>
      </section>
    </Page>
  </ApplicationShell>
)

export default App
export { ErrorBoundary }
