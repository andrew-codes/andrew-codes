import styled from "@emotion/styled"
import Stack from "@mui/joy/Stack"
import type {
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import type { FC } from "react"
import { fileURLToPath } from "url"
import { useMediaQuery } from "usehooks-ts"
import {
  Address,
  ConnectionList,
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
} from "../components/ContactCard"
import PageHeader from "../components/PageHeader"
import {
  Education,
  List,
  Page,
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
  WorkExperience,
} from "../components/resume"
import { getFilePartsToHash, getHash } from "../libs/hash.server"
import { getServerTimeHeader } from "../libs/timing.server"
import { useLoaderHeaders } from "../libs/utils"

const loader = async (args: LoaderFunctionArgs) => {
  const __filename = fileURLToPath(import.meta.url)
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
const Root = styled.div`
  margin: 0;

  > * {
    margin: 0 2rem;
    max-width: 1200px;
    min-width: 390px;
  }
`
const Main = styled.main`
  background-color: rgb(249, 251, 253);
  border-radius: 1rem;

  > *:nth-child(1) {
    border-radius: 1rem 1rem 0 0;
  }

  @media (max-width: 640px) {
    border-radius: 1rem 1rem 0 0;
    margin: 0;
    padding-top: 0.25rem;
  }

  @media print {
    background-color: transparent;
    margin: 0 auto;
    padding: 0;
  }

  > * {
    margin: 0 auto;
    color: rgb(80, 80, 80);
    font-family: "Lato";
    font-size: 12pt;
  }
`

const Note = styled.div`
  background-color: rgba(223, 201, 138, 1);
  color: rgb(0, 0, 0);
  display: block;
  font-size: 1.25rem;
  padding: 1rem;
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 640px) {
    border-radius: 1rem;
    width: unset;
    margin: 0.5rem;
  }

  @media print {
    display: none;
  }
`

const meta: MetaFunction = () => [
  {
    title: "James Andrew Smith - Resume",
  },
  {
    name: "description",
    content:
      "Staff-level software engineer with 15 years of experience designing scalable, high-impact front-end systems at enterprise scale. Proven leader in front-end architecture, developer experience, and testing strategy.",
  },
  { name: "og:title", content: "James Andrew Smith - Resume" },
  {
    name: "og:description",
    content:
      "Staff-level software engineer with 15 years of experience designing scalable, high-impact front-end systems at enterprise scale. Proven leader in front-end architecture, developer experience, and testing strategy.",
  },
]

const ResumeRoute: FC<{}> = () => {
  const today = new Date()
  const yearsOfExperience =
    new Date(today.getTime() - new Date(2008, 1, 1).getTime()).getFullYear() -
    1970

  const matchesPrint = useMediaQuery("print")

  return (
    <Stack direction="column" spacing={4}>
      {!matchesPrint && <PageHeader />}
      <Root>
        <Main>
          <Note>
            Need a printed or PDF version? This resume is optimized for print.
            Simply print this page (without headers and footers) to a printer or
            to PDF.
          </Note>
          <Page>
            <ContactCard as={ResumeContactCard}>
              <FullName
                as={ResumeFullName}
                sx={(theme) => ({
                  color: theme.palette.primary.plainColor,
                })}
              >
                James Andrew Smith
              </FullName>
              <JobTitle as={ResumeJobTitle}>Staff Software Engineer</JobTitle>
              <ContactInformation as={ResumeContactInformation}>
                <ConnectionList>
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
                  <Email as={ResumeLink} href="mailto:jas@andrew.codes">
                    jas@andrew.codes
                  </Email>
                </ConnectionList>
                <ConnectionList>
                  <Url
                    as={ResumeLink}
                    href="https://linkedin.com/in/JamesAndrewSmith"
                  >
                    linkedin.com/in/jamesandrewsmith
                  </Url>
                  <Url as={ResumeLink} href="https://andrew.codes">
                    andrew.codes
                  </Url>
                  <Url as={ResumeLink} href="https://github.com/andrew-codes">
                    github.com/andrew-codes
                  </Url>
                </ConnectionList>
              </ContactInformation>
              <Notes as={ResumeNotes}>
                <Paragraph>
                  Staff-level software engineer with {yearsOfExperience} years
                  of experience designing scalable, high-impact front-end
                  systems at enterprise scale. Proven leader in front-end
                  architecture, developer experience, and testing strategy.
                  Trusted mentor across teams for building sustainable
                  engineering practices. Speaker and contributor to the React
                  and GraphQL communities.
                </Paragraph>
                <List>
                  <li>
                    Specializes in front-end architecture, performance, and
                    developer experience; using React.js, TypeScript, and
                    GraphQL
                  </li>
                  <li>
                    Enjoys mentoring and contributing to open source; including
                    contributions to Gatsby and Cypress
                  </li>
                  <li>
                    Co-founder of{" "}
                    <ResumeLink
                      href="https://www.meetup.com/react-atl/"
                      title="ReactATL meetup"
                    >
                      ReactATL
                    </ResumeLink>
                    ; meetup of over 4K engineers and community members
                  </li>
                  <li>
                    Delivered 7 workshops and presentations at major
                    conferences; focused on React.js, Redux, and GraphQL
                  </li>
                  <li>
                    Uses system languages{" "}
                    <ResumeAbbr title="C sharp programming language">
                      C#
                    </ResumeAbbr>{" "}
                    and Node.js to build scalable, distributed systems deployed
                    with Kubernetes, docker, and native cloud solutions
                  </li>
                </List>
              </Notes>
            </ContactCard>
            <Section title="Recent Professional Experience">
              <WorkExperience
                role="Staff-level Software Engineer (L64)"
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
                description={
                  <>
                    Develop distributed{" "}
                    <ResumeAbbr title="content management system">
                      CMS
                    </ResumeAbbr>{" "}
                    , focusing on authoring tooling and content delivery, for
                    support.microsoft.com, Office applications, and Windows.
                    Influential technical leadership and mentorship across 5
                    teams.
                  </>
                }
                keyTechnologies={
                  "TypeScript, React.js, Node.js, Next.js, Redux, GraphQL, Nx, C#, microservices, Azure, TDD, XP, git, Kanban"
                }
              >
                <List>
                  <li>
                    Architected front-end platform powering{" "}
                    <ResumeAbbr title="Content management system">
                      CMS
                    </ResumeAbbr>{" "}
                    systems for support.microsoft.com, Office, and Windows;
                    serving 2B+ users and handling 1B+ requests monthly.
                  </li>
                  <li>
                    Designed a scalable authoring tool to enable content
                    onboarding for Co-pilot Labs and partner teams, accelerating
                    Microsoft's generative{" "}
                    <ResumeAbbr title="Artificial Intelligence">AI</ResumeAbbr>{" "}
                    initiative.
                  </li>
                  <li>
                    Led strategic adoption of Jest and Cypress across 8 teams,
                    increasing test coverage from 0% to 60% and cutting
                    regression support costs by 30%.
                  </li>
                  <li>
                    Consolidated microservices into a monorepo with Nx and Yarn{" "}
                    <ResumeAbbr title="Plug and Play">PnP</ResumeAbbr>,
                    improving{" "}
                    <ResumeAbbr title="Continuous integration">CI</ResumeAbbr>{" "}
                    cycle time by 95% and enhancing developer workflows.
                  </li>
                  <li>
                    Created and open-sourced an{" "}
                    <ResumeAbbr title="Artificial Intelligence">AI</ResumeAbbr>
                    -driven project forecasting tool, improving timeline
                    communication to leadership by 80%.
                  </li>
                  <li>
                    Championed the adoption of Extreme Programming (XP)
                    methodologies across five teams, mentoring 20+ engineers and
                    elevating code quality measured by a reduction in support
                    cost.
                  </li>
                </List>
              </WorkExperience>
              <WorkExperience
                role="Lead Front-End Engineer (Staff-level)"
                orgName="Experience, LLC"
                location="Remote"
                from={<time dateTime="2019-06">Jun 2019</time>}
                to={<time dateTime="2020-12">Dec 2020</time>}
                description={
                  <>
                    Owned front-end architecture across 3 cross-functional
                    teams. Partnered with leadership to deliver scalable
                    user-facing platforms aligned with business goals.
                  </>
                }
                keyTechnologies={
                  "TypeScript, React.js, Node.js, Redux, TDD, Jest, Cypress, Docker, microservices, AWS, git, Scrum"
                }
              >
                <List>
                  <li>
                    Developed a React.js component library adopted by all
                    applications, improving design consistency and feature
                    velocity.
                  </li>
                  <li>
                    Instituted 'Three Amigos' model to align product,
                    engineering, and leadership vision; reducing planning time
                    by 75%.
                  </li>
                  <li>
                    Championed Cypress-based testing pipelines integrated with
                    Docker-based ephemeral{" "}
                    <ResumeAbbr title="Continuous integration">CI</ResumeAbbr>{" "}
                    environments.
                  </li>
                  <li>
                    Mentored 3 cross-functional teams on React.js, Redux, and{" "}
                    <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                    practices, fostering enhanced team productivity
                  </li>
                </List>
              </WorkExperience>
              <WorkExperience
                role="Senior Software Engineer (Staff-level)"
                orgName="VersionOne, CollabNet"
                location="Atlanta, GA (Hybrid)"
                from={<time dateTime="2014-09">Sept 2014</time>}
                to={<time dateTime="2019-06">Jun 2019</time>}
                description={
                  <>
                    Technical lead for high-profile features on flagship{" "}
                    <ResumeAbbr title="Agile Lifecycle Management">
                      ALM
                    </ResumeAbbr>{" "}
                    product; including road mapping, time sheets and UI for
                    domain-level filtering in an{" "}
                    <ResumeAbbr title="Extreme programming">XP</ResumeAbbr> and{" "}
                    <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                    environment.
                  </>
                }
                keyTechnologies={
                  "JavaScript, React.js, Redux, AngularJs, Backbone.JS, jQuery, C#, MVC.NET, Node.js, TDD, XP, gulp, git, Kanban"
                }
              >
                <List>
                  <li>
                    Led modernization of a proprietary JavaScript front-end to{" "}
                    <ResumeAbbr title="EcmaScript 6 (JavaScript version)">
                      ES6
                    </ResumeAbbr>{" "}
                    and React.js across 5 teams, reducing tech debt by 30%.
                  </li>
                  <li>
                    Built and maintained an{" "}
                    <ResumeAbbr title="Open source software">OSS</ResumeAbbr>{" "}
                    React component library and JavaScript{" "}
                    <ResumeAbbr title="Software development kit">
                      SDK
                    </ResumeAbbr>{" "}
                    used internally and by Fortune 500 customers.
                  </li>
                  <li>
                    Served as technical advisor for front-end architecture and
                    tooling strategy across 2 products and 5 teams.
                  </li>
                </List>
              </WorkExperience>
              <WorkExperience
                role="Senior Software Engineer"
                orgName="MATRIX Professional Services"
                location="Atlanta, GA (Hybrid)"
                from={<time dateTime="2013-02">Feb 2013</time>}
                to={<time dateTime="2014-09">Sept 2014</time>}
                description={
                  <>
                    Focused on full-stack development using{" "}
                    <ResumeAbbr title="C sharp programming language">
                      C#
                    </ResumeAbbr>
                    , JavaScript, React, and{" "}
                    <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                    for major clients.
                  </>
                }
                keyTechnologies={
                  "C#, MVC.NET, Node.js, JavaScript, React.js, jQuery, KnockoutJS, TDD, Jasmine, Karma, MSTest, Scrum, grunt, git"
                }
              >
                <List>
                  <li>
                    Delivered a redesigned e-commerce checkout for a major
                    client, reducing steps by 50% and improving conversion rates
                  </li>
                  <li>
                    Led React.js adoption across teams; created onboarding
                    curriculum and mentored 7+ engineers
                  </li>
                  <li>
                    Implemented CI-ready test frameworks (Jasmine, Mocha, Karma)
                    integrated with Gulp/Grunt; reducing defects by ~60%.
                  </li>
                </List>
              </WorkExperience>
            </Section>
            <Section title="Earlier Roles">
              <WorkExperience
                summarized
                role="Software Engineer"
                orgName="MModal"
                location="Atlanta, GA"
                from={<time dateTime="2012-09">Sept 2012</time>}
                to={<time dateTime="2013-02">Feb 2013</time>}
                description={
                  <>
                    built medical coding platform in a regulated healthcare
                    environment
                  </>
                }
              ></WorkExperience>
              <WorkExperience
                summarized
                role="Web Application Developer"
                orgName="Response Mine Interactive"
                location="Atlanta, GA"
                from={<time dateTime="2012-03">Mar 2012</time>}
                to={<time dateTime="2012-09">Sept 2012</time>}
                description={<>high-scale marketing sites</>}
              ></WorkExperience>
              <WorkExperience
                summarized
                role="Senior Software Engineer"
                orgName="DAXKO"
                location="Birmingham, AL"
                from={<time dateTime="2011-08">Aug 2011</time>}
                to={<time dateTime="2012-03">Mar 2012</time>}
                description={<>migrated legacy WebForms to MVC.NET</>}
              ></WorkExperience>
              <WorkExperience
                summarized
                role="Software Engineer 3"
                orgName="MedSEEK"
                location="Birmingham, AL"
                from={<time dateTime="2011-02">Feb 2011</time>}
                to={<time dateTime="2011-08">Aug 2011</time>}
                description={<>improved e-healthcare platform, Coldstone</>}
              ></WorkExperience>
              <WorkExperience
                summarized
                role="Software Engineer 3"
                orgName="Intermark Interactive"
                location="Birmingham, AL"
                from={<time dateTime="2010-01">Jan 2010</time>}
                to={<time dateTime="2011-02">Feb 2011</time>}
                description={
                  <>delivered features for high-profile BuyAToyota.com</>
                }
              ></WorkExperience>
              <WorkExperience
                summarized
                role="Adjunct Faculty"
                orgName="Columbus Technical College"
                location="Columbus, GA"
                from={<time dateTime="2008-06">Jun 2008</time>}
                to={<time dateTime="2009-12">Dec 2009</time>}
                description={<>worked with business & developed curriculum</>}
              ></WorkExperience>
            </Section>
            {/* <Section title="Community">
            <SummarizedItems>
              <SummarizedItem
                role="Mentor"
                name="Community"
                on={
                  <>
                    <time dateTime="2012">2012</time> -{" "}
                    <time dateTime="2021">2024</time>
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
                name="Learn Redux by Building Redux"
                on={<time dateTime="2017">2017</time>}
              />
              <SummarizedItem
                role="Workshop Host"
                name="Intro to React"
                on={<time dateTime="2016">2016</time>}
              />
              <SummarizedItem
                role="Speaker"
                name="Intro to React"
                on={<time dateTime="2016">2016</time>}
              />
              <SummarizedItem
                role="Speaker"
                name="Meetup - React with GraphQL"
                on={<time dateTime="2015">2015</time>}
              />
              <SummarizedItem
                role="Speaker"
                name="Let's Talk about Flux"
                on={<time dateTime="2015">2015</time>}
              />
              <SummarizedItem
                role="Speaker"
                name="Let's Talk about Flux"
                on={<time dateTime="2015">2015</time>}
              />
            </SummarizedItems>
          </Section> */}
            <Section title="Education">
              <Education
                degree="Bachelor of Science in Computer Science"
                schoolName="Columbus State University"
                locality="Columbus"
                obtainedOn={
                  <>
                    <time dateTime="2008-06">Jun 2008</time>
                  </>
                }
                region={<ResumeAbbr title="Georgia">GA</ResumeAbbr>}
              />
            </Section>
          </Page>
        </Main>
      </Root>
    </Stack>
  )
}

export default ResumeRoute
export { headers, loader, meta }
