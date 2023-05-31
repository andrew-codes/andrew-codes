import type {
  HeadersFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import type { FC } from "react"
import styled, { createGlobalStyle } from "styled-components"
import {
  Address,
  ContactCard,
  ContactInformation,
  Email,
  FullName,
  JobTitle,
  Locality,
  Notes,
  Region,
  Telephone,
  Url,
} from "~/components/ContactCard"
import {
  Education,
  List,
  Page,
  PaginatedResume,
  Paragraph,
  ResumeAbbr,
  ResumeAddress,
  ResumeContactCard,
  ResumeContactInformation,
  ResumeFullName,
  ResumeJobTitle,
  ResumeLink,
  ResumeNotes,
  Section,
  Strong,
  SummarizedItem,
  SummarizedItems,
  WorkExperience,
} from "~/components/resume"
import { getFilePartsToHash, getHash } from "~/libs/hash.server"
import { getServerTimeHeader } from "~/libs/timing.server"
import { useLoaderHeaders } from "~/libs/utils"

const meta: V2_MetaFunction = () => {
  return [{ title: "Andrew Smith | Resume" }]
}

const loader = async (args: LoaderArgs) => {
  const selfFilePartsToHash = await getFilePartsToHash(__filename)
  const timings = {}

  return json(
    {},
    {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=3600",
        Vary: "Cookie",
        "Server-Timing": getServerTimeHeader(timings),
        ETag: getHash([selfFilePartsToHash]),
      },
    },
  )
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const headers: HeadersFunction = useLoaderHeaders()

const Main = styled.main`
  margin: 0;
`

const GlobalStyles = createGlobalStyle`
    body {
        background-color: rgb(249,251,253) !important;

        @media print {
            background-color: transparent !important;
            padding: 0 !important;
        }
    }

    * {
        color: rgb(80,80,80);
        font-family: 'Lato-Regular';
        font-size: 12pt;
    }
`
const Note = styled.div`
  display: none;

  @media (max-width: 600px) {
    background: rgba(198, 75, 87, 0.75);
    border: 4px solid rgba(196, 75, 120);
    color: rgb(0, 0, 0);
    display: block;
    font-size: 1.25rem;
    margin: 0 auto;
    margin: 0.5rem;
    padding: 0.5rem;

    strong {
      color: rgb(0, 0, 0);
      font-size: 1.25rem;
      text-decoration: underline;
    }
  }
`

const ResumeRoute: FC<{}> = () => {
  const today = new Date()
  const yearsOfExperience =
    new Date(today.getTime() - new Date(2008, 1, 1).getTime()).getFullYear() -
    1970

  return (
    <>
      <GlobalStyles />
      <Note>
        Please note: this resume is optimized for <strong>print</strong> and{" "}
        <strong>desktop</strong> media. Try printing the page (without headers
        and footers) or view on your desktop.
      </Note>
      <Main>
        <PaginatedResume>
          <Page>
            <ContactCard as={ResumeContactCard}>
              <FullName as={ResumeFullName}>James Andrew Smith</FullName>
              <JobTitle as={ResumeJobTitle}>Senior Software Engineer</JobTitle>
              <ContactInformation as={ResumeContactInformation}>
                <Address as={ResumeAddress}>
                  <Locality>Atlanta</Locality>,{" "}
                  <Region as={ResumeAbbr} title="Georgia">
                    GA
                  </Region>
                </Address>
                <Telephone
                  as={ResumeLink}
                  href="tel:4705359093"
                  title="Mobile number"
                >
                  +1.470.535.9093
                </Telephone>
                <Email as={ResumeLink} href="mailto:andrew@andrew.codes">
                  andrew@andrew.codes
                </Email>
                <Url
                  as={ResumeLink}
                  href="https://linkedin.com/in/JamesAndrewSmith"
                >
                  linkedin.com/in/jamesandrewsmith
                </Url>
              </ContactInformation>
              <Notes as={ResumeNotes}>
                <Paragraph>
                  Senior engineer at Microsoft, seeking principal role, with{" "}
                  <Strong>{yearsOfExperience} years</Strong> of full-stack
                  development experience and expert knowledge of the React
                  ecosystem. A few highlights:
                </Paragraph>
                <List>
                  <li>
                    Data-driven forecasting of timelines using only historical
                    item completion dates; no estimates needed, only story
                    count;{" "}
                    <ResumeLink href="https://github.com/andrew-codes/forecast-work">
                      github.com/andrew-codes/forecast-work
                    </ResumeLink>
                  </li>
                  <li>
                    Worked in wide variety of industries and company sizes;
                    exposed to many processes and tools aimed to enable agility,
                    including Kanban, Scrum, and{" "}
                    <ResumeAbbr title="Extreme programming">XP</ResumeAbbr>
                  </li>
                  <li>
                    Passion for front-end, but with equally vast depth of
                    knowledge in back-end, infrastructure, and cloud
                    technologies; including git, shell, Node.js, C#, SQL,{" "}
                    <ResumeAbbr title="Kubernetes">k8s</ResumeAbbr>, Docker/
                    <ResumeAbbr title="Linux containers">LXC</ResumeAbbr>
                  </li>
                  <li>
                    Speaker and community mentor; contributed to OSS projects
                    including Gatsby, Cypress, Glamorous, VS Code Grammarly,
                    VersionOne SDKs and component library, Coder Dojo lessons,
                    Hacktoberfest
                  </li>
                </List>
              </Notes>
            </ContactCard>
            <Section title="Work Experience">
              <WorkExperience
                role="Senior Software Engineer (64)"
                orgName="Microsoft"
                location="Remote"
                from={<time dateTime="2020-12">Dec 2020</time>}
                to={
                  <time
                    dateTime={`${today.getFullYear()}-${today.getMonth() + 1}`}
                  >
                    present
                  </time>
                }
              >
                <Paragraph>
                  Influential technical leader, mentor, overseeing delivery of
                  high profile projects, with a focus on React, C#, GraphQL and
                  microservices; advocating quality, performance, and enjoyable
                  customer experiences.
                </Paragraph>
                <List>
                  <li>
                    Achieved 49% reduction in key user-facing performance
                    metrics through design and execution of{" "}
                    <ResumeAbbr title="Command Query Responsibility Segregation">
                      CQRS
                    </ResumeAbbr>{" "}
                    with GraphQL; exhibited leadership to plan and execute
                    across 3 teams
                  </li>
                  <li>
                    Technical leadership in React, TypeScript, Redux, Node.js,{" "}
                    <ResumeAbbr title="C sharp programming language">
                      C#
                    </ResumeAbbr>
                    , federated GraphQL, Microservice architecture,{" "}
                    <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                    and pair-programming practices; direct mentorship of 5
                    engineers
                  </li>
                  <li>
                    Instill a culture of quality by introducing React/TypeScript
                    testing via Jest and Cypress; advocate for pragmatic{" "}
                    <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>
                    ; increasing test coverage from 0% to 52%
                  </li>
                  <li>
                    Improve reliability, reduce complexity, and times for{" "}
                    <ResumeAbbr title="Continuous integration automation">
                      CI
                    </ResumeAbbr>{" "}
                    in mono-repo from hours to minutes; implementing Nx,
                    upgrading to Yarn with{" "}
                    <ResumeAbbr title="Plug and play">PnP</ResumeAbbr>; breaking
                    monolith into small{" "}
                    <ResumeAbbr title="Node.js package management">
                      NPM
                    </ResumeAbbr>{" "}
                    packages
                  </li>
                </List>
              </WorkExperience>
              <WorkExperience
                role="Lead Front-End Engineer"
                orgName="Experience, LLC"
                location="Remote"
                note="closed due to COVID-19"
                from={<time dateTime="2019-06">June 2019</time>}
                to={<time dateTime="2020-12">Dec 2020</time>}
              >
                <Paragraph>
                  Oversaw and guided all aspects of front-end development for
                  teams, communicated with stakeholders and executive
                  leadership, ensured experiences that delight customers.
                </Paragraph>
                <List>
                  <li>
                    Leveraged data science team and feedback to improve customer
                    experience via creating{" "}
                    <ResumeAbbr title="User experience">UX</ResumeAbbr> design
                    language backed by React component library{" "}
                    <ResumeAbbr title="Node.js package management">
                      NPM
                    </ResumeAbbr>{" "}
                    packages
                  </li>
                  <li>
                    Increased teams' delivery speed and reduce requirements
                    churn to ensure the right value is delivered through
                    institution of "Three Amigos"
                  </li>
                  <li>
                    Mentored and guided teams of engineers; React, Redux,
                    TypeScript,{" "}
                    <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>
                    ; introduced Cypress{" "}
                    <ResumeAbbr title="end-to-end tests">E2E</ResumeAbbr>{" "}
                    testing and automation
                  </li>
                </List>
              </WorkExperience>
            </Section>
          </Page>
          <Page>
            <Section title="Work Experience ... continued">
              <WorkExperience
                role="Senior Software Engineer"
                orgName="VersionOne, CollabNet"
                location="Atlanta, GA (Hybrid)"
                from={<time dateTime="2014-09">Sept 2014</time>}
                to={<time dateTime="2019-06">June 2019</time>}
              >
                <Paragraph>
                  Feature lead for high-profile features on flagship{" "}
                  <ResumeAbbr title="Agile Lifecycle Management">
                    ALM
                  </ResumeAbbr>{" "}
                  product; including road map visualization, time sheets, UI
                  query filters in an{" "}
                  <ResumeAbbr title="Extreme programming">XP</ResumeAbbr> and{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                  environment. Established{" "}
                  <ResumeAbbr title="Open source software">OSS</ResumeAbbr>{" "}
                  component library package.
                </Paragraph>
                <List>
                  <li>
                    Modernized front-end by owning adoption of React, Redux
                    stack across 4 teams; comprehensive refactor of custom{" "}
                    <ResumeAbbr title="EcmaScript 5 (JavaScript version)">
                      ES5
                    </ResumeAbbr>{" "}
                    modules to{" "}
                    <ResumeAbbr title="EcmaScript 6 (JavaScript version)">
                      ES6
                    </ResumeAbbr>{" "}
                    and reduction of technology stacks
                  </li>
                  <li>
                    Streamlined processes between UX and Engineering through the
                    creation of React based component library and design
                    language documentation; tested via Cypress and Storybook
                  </li>
                  <li>
                    Owned{" "}
                    <ResumeAbbr title="Open source software">OSS</ResumeAbbr>{" "}
                    JavaScript SDK with high impact to third party integrations;
                    driving many internal business processes of Fortune 500
                    companies
                  </li>
                </List>
              </WorkExperience>
              <WorkExperience
                role="Senior Software Engineer"
                orgName="MATRIX Professional Services"
                location="Atlanta, GA (Hybrid)"
                from={<time dateTime="2013">2013</time>}
                to={<time dateTime="2014">2014</time>}
              >
                <Paragraph>
                  Engineer and mentor of Agile teams for major clients as a
                  consultant engineer; focused on full-stack development in{" "}
                  <ResumeAbbr title="C sharp programming language">
                    C#
                  </ResumeAbbr>
                  , JavaScript, React, and{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>;
                  for both front-end and back-end stacks.
                </Paragraph>
                <List>
                  <li>
                    Founded company craftsman fellowship program and its
                    curriculum; technical mentorship on engineering patterns,
                    best practices and technologies; including React and other
                    front-end frameworks
                  </li>
                  <li>
                    Technical leadership in JavaScript, Node.js, Knockout.js,
                    gulp, grunt, and test frameworks: jasmine, mocha, chai,
                    sinon, karma
                  </li>
                  <li>
                    React early adopter; pioneered its usage and incorporation
                    into company's core competencies
                  </li>
                </List>
              </WorkExperience>
              <SummarizedItems>
                <SummarizedItem
                  role="Software Engineer"
                  name="M*Modal"
                  on={<time dateTime="2012">2013</time>}
                />
                <SummarizedItem
                  role="Software Engineer"
                  name="Response Mine Interactive"
                  note="moved to Atlanta"
                  on={
                    <>
                      <time dateTime="2012">2012</time> -{" "}
                      <time dateTime="2013">2013</time>
                    </>
                  }
                />
                <SummarizedItem
                  role="Senior .NET Engineer"
                  name="DAXKO"
                  on={
                    <>
                      <time dateTime="2011">2011</time> -{" "}
                      <time dateTime="2012">2012</time>
                    </>
                  }
                />
                <SummarizedItem
                  role="Software Engineer"
                  name="Medseek"
                  on={<time dateTime="2011">2011</time>}
                />
                <SummarizedItem
                  role="Software Engineer 3"
                  name="Intermark Interactive"
                  on={
                    <>
                      <time dateTime="2009">2009</time> -{" "}
                      <time dateTime="2011">2011</time>
                    </>
                  }
                />
              </SummarizedItems>
            </Section>
            <Section title="Community">
              <SummarizedItems>
                <SummarizedItem
                  role="Mentor"
                  name="Community"
                  on={
                    <>
                      <time dateTime="2012">2012</time> -{" "}
                      <time dateTime="2021">2021</time>
                    </>
                  }
                />
                <SummarizedItem
                  role="Co-Organizer"
                  name="ReactATL"
                  on={
                    <>
                      <time dateTime="2015">2015</time> -{" "}
                      <time dateTime="2017">2017</time>
                    </>
                  }
                />
                <SummarizedItem
                  role="Workshop Host"
                  name="Learn Redux by Building It"
                  on={<time dateTime="2017">2017</time>}
                />
                <SummarizedItem
                  role="Workshop Host"
                  name="Connect.Tech Conference - React"
                  on={<time dateTime="2016">2016</time>}
                />
                <SummarizedItem
                  role="Speaker"
                  name="Connect.Tech Conference - Intro to React"
                  on={<time dateTime="2016">2016</time>}
                />
                <SummarizedItem
                  role="Speaker"
                  name="Meetup - React with GraphQL"
                  on={<time dateTime="2015">2015</time>}
                />
                <SummarizedItem
                  role="Speaker"
                  name="Connect.Tech Conference - Let's Talk about Flux"
                  on={<time dateTime="2015">2015</time>}
                />
                <SummarizedItem
                  role="Speaker"
                  name="Meetup - Let's Talk about Flux"
                  on={<time dateTime="2015">2015</time>}
                />
              </SummarizedItems>
            </Section>
            <Section title="Education">
              <Education
                degree="Bachelor of Science in Computer Science"
                schoolName="Columbus State University"
                locality="Columbus"
                obtainedOn={
                  <>
                    <time dateTime="2008">2008</time>
                  </>
                }
                region={<ResumeAbbr title="Georgia">GA</ResumeAbbr>}
              />
            </Section>
          </Page>
        </PaginatedResume>
      </Main>
    </>
  )
}

export default ResumeRoute
export { headers, loader, meta }
