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
  background-color: rgb(249, 251, 253) !important;
  border-radius: 1rem;
  margin: 0 2rem;
  padding-top: 1rem;

  @media (max-width: 640px) {
    border-radius: 1rem 1rem 0 0;
    margin: 0;
    padding-top: 0.25rem;
  }

  > * {
    margin: 0 auto;
  }
`

const GlobalStyles = createGlobalStyle`
    body {
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
  background-color: rgba(223, 201, 138, 1);
  border: 4px solid rgba(223, 184, 90, 1);
  color: rgb(0, 0, 0);
  display: block;
  font-size: 1.25rem;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  padding: 1rem;
  box-sizing: border-box;
  width: 8.5in;

  @media (max-width: 640px) {
    border-radius: 1rem;
    width: unset;
    margin: 0.5rem;
  }

  @media print {
    display: none;
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
      <Main>
        <Note>
          Need a printed or PDF version? This resume is optimized for print.
          Simply print this page (without headers and footers) to a printer or
          to PDF.
        </Note>
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
                Senior Software engineer with {yearsOfExperience} years of
                experience in full-stack development, technical leadership, and
                unique insights into delivering and scaling software. Proven
                experience with React/TypeScript, system languages, and
                associated principles. Direct impact and technical influence on
                organizations ranging from 3 to 50+ engineers.
              </Paragraph>
              <Section title="Highlights">
                <List>
                  <li>
                    Focusing on front-end, but with equally vast depth of
                    knowledge in back-end, infrastructure, and cloud providers;
                    including{" "}
                    <ResumeAbbr title="C sharp programming language">
                      C#
                    </ResumeAbbr>
                    , Node.js,{" "}
                    <ResumeAbbr title="Structured Query Language">
                      SQL
                    </ResumeAbbr>
                    , Kubernetes, Docker/
                    <ResumeAbbr title="Linux containers">LXC</ResumeAbbr>, git,
                    and bash
                  </li>
                  <li>
                    Active community member through speaking and OSS
                    contributions; including Gatsby, Cypress, Glamorous, VS Code
                    Grammarly, VersionOne SDKs and component library, Coder Dojo
                    lessons, Hacktoberfest
                  </li>
                  <li>
                    Experience with Kanban, Scrum,{" "}
                    <ResumeAbbr title="Extreme programming">XP</ResumeAbbr>, and
                    other techniques enabling agility
                  </li>
                  <li>
                    Polyglot programmer with interest in Python, Elixir, and
                    Rust
                  </li>
                </List>
              </Section>
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
              description={
                <>
                  Influential technical leader, mentor, overseeing delivery of
                  high profile projects coordinated across 4 teams, with a focus
                  on React,{" "}
                  <ResumeAbbr title="C sharp programming language">
                    C#
                  </ResumeAbbr>
                  ,{" "}
                  <ResumeAbbr title="Graph Query Language">GraphQL</ResumeAbbr>{" "}
                  and microservices operating CMS driving all content for
                  support.microsoft.com, Office applications, and Windows.
                </>
              }
              keyTechnologies={
                "C#, TypeScript, Node.js, React, Redux, GraphQL, Azure, TDD, XP, microservices, distributed systems design"
              }
            >
              <List>
                <li>
                  Achieved 90% reduction in key user-facing performance metrics
                  through design and execution of{" "}
                  <ResumeAbbr title="Command Query Responsibility Segregation">
                    CQRS
                  </ResumeAbbr>{" "}
                  and federated{" "}
                  <ResumeAbbr title="Graph Query Language">GraphQL</ResumeAbbr>{" "}
                  in a distributed application architecture; leadership to plan
                  and deliver across 3 teams
                </li>
                <li>
                  Expand technical leadership to 3 teams and mentor 5 engineers;
                  including concrete applications of SOLID, React ecosystem,{" "}
                  <ResumeAbbr title="C sharp programming language">
                    C#
                  </ResumeAbbr>
                  , federated{" "}
                  <ResumeAbbr title="Graph Query Language">GraphQL</ResumeAbbr>,
                  and microservice architecture
                </li>
                <li>
                  Increase test coverage from 0% to 52% through institution of
                  unit and component testing via Jest and Cypress; advocate
                  practitioner for pragmatic{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>
                </li>
                <li>
                  Reduce time creating and communicating project timelines to
                  leadership by ~80% by engineering forecasting tool, leveraging
                  AI and historical data without requiring estimates
                </li>
                <li>
                  Reduce{" "}
                  <ResumeAbbr title="Continuous integration automation">
                    CI
                  </ResumeAbbr>{" "}
                  times by 83% via improving reliability with Yarn{" "}
                  <ResumeAbbr title="Plug and Play">PnP</ResumeAbbr>, reducing
                  complexity with Nx, and breaking monolithic apps into small
                  packages
                </li>
              </List>
            </WorkExperience>
            <WorkExperience
              role="Lead Front-End Engineer"
              orgName="Experience, LLC"
              location="Remote"
              from={<time dateTime="2019-06">Jun 2019</time>}
              to={<time dateTime="2020-12">Dec 2020</time>}
              description={
                <>
                  Guided all aspects of front-end development for 2 teams,
                  communicated with stakeholders and executive leadership,
                  ensured experiences that delight customers.
                </>
              }
              keyTechnologies={
                "Java, Groovy, Grails, TypeScript, Node.js, React, Redux, TDD, Jest, Cypress, Docker, AWS, microservices, SCRUM, git"
              }
            >
              <List>
                <li>
                  Leveraged data science and customer feedback to accelerate
                  delivery of consistent user experiences with introduced design
                  language and React component library
                </li>
                <li>
                  Established "Three Amigos" process drove improved alignment of
                  delivered value with 75% reduction of engineering time
                  investment, increasing the team velocity by 20%
                </li>
                <li>
                  Guided 3 teams of engineers; React, Redux, TypeScript,
                  innovated usage of{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                  and Cypress{" "}
                  <ResumeAbbr title="end-to-end tests">E2E</ResumeAbbr> testing
                  and automation
                </li>
              </List>
            </WorkExperience>
            <WorkExperience
              role="Senior Software Engineer"
              orgName="VersionOne, CollabNet"
              location="Atlanta, GA (Hybrid)"
              from={<time dateTime="2014-09">Sept 2014</time>}
              to={<time dateTime="2019-06">Jun 2019</time>}
              description={
                <>
                  Technical lead for over 3 high-profile features on flagship{" "}
                  <ResumeAbbr title="Agile Lifecycle Management">
                    ALM
                  </ResumeAbbr>{" "}
                  product; including road mapping, time sheets, UI query filters
                  in an <ResumeAbbr title="Extreme programming">XP</ResumeAbbr>{" "}
                  and{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                  environment.
                </>
              }
              keyTechnologies={
                "C#, MVC.NET, Node.js, JavaScript, React, Redux, jQuery, AngularJS, Backbone.JS, TDD, XP, Kanban, gulp, git"
              }
            >
              <List>
                <li>
                  Modernized front-end by owning adoption of React, Redux stack
                  across 4 teams; comprehensive refactor of custom{" "}
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
                  Established adoption of React as primary front-end technology
                  stack used by 5 teams across 2 products; systematically
                  replacing fragmented framework usages of jQuery, AngularJS,
                  and Backbone.JS
                </li>
                <li>
                  Streamlined processes between UX and Engineering through the
                  creation of React based component library and design language
                  documentation; tested via Cypress and Storybook
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
              from={<time dateTime="2013-02">Feb 2013</time>}
              to={<time dateTime="2014-09">Sept 2014</time>}
              description={
                <>
                  Engineer and coach, focused on full-stack development in{" "}
                  <ResumeAbbr title="C sharp programming language">
                    C#
                  </ResumeAbbr>
                  , JavaScript, React, and{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>,
                  for major clients. Presented a total of over 6 workshops;
                  topics ranging from{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>,
                  SOLID principles, and git.
                </>
              }
              keyTechnologies={
                "C#, MVC.NET, PHP, Node.js, JavaScript, React, jQuery, KnockoutJS, TDD, Jasmine, Karma, MSTest, SCRUM, grunt, git"
              }
            >
              <List>
                <li>
                  Prepared redesigned checkout process for a major e-commerce
                  store; reducing steps to action by 50% and increasing sales by
                  an undisclosed amount
                </li>
                <li>
                  Reduced defects in new features by ~60% through of testing
                  mechanisms, including jasmine, mocha, chai, sinon, and karma,
                  and CI automation via gulp and grunt
                </li>
                <li>
                  React early adopter; pioneered usage and incorporation into
                  company's core competencies; including training of 7+
                  engineers
                </li>
                <li>
                  Founded company craftsman fellowship program and curriculum;
                  onboarding 2 new hires into the program
                </li>
              </List>
            </WorkExperience>
            <WorkExperience
              role="Software Engineer"
              orgName="MModal"
              location="Atlanta, GA"
              from={<time dateTime="2012-09">Sept 2012</time>}
              to={<time dateTime="2013-02">Feb 2013</time>}
              description={
                <>
                  Excelled in an position focused on Fluency for Coding, a
                  medical coding and billing web application.
                </>
              }
            ></WorkExperience>
            <WorkExperience
              role="Web Application Developer"
              orgName="Response Mine Interactive"
              location="Atlanta, GA"
              from={<time dateTime="2012-03">Mar 2012</time>}
              to={<time dateTime="2012-09">Sept 2012</time>}
              description={
                <>
                  Guided design of custom CMS to manage content across over 10
                  web properties.
                </>
              }
            ></WorkExperience>
            <WorkExperience
              role="Senior Software Engineer"
              orgName="DAXKO"
              location="Birmingham, AL"
              from={<time dateTime="2011-08">Aug 2011</time>}
              to={<time dateTime="2012-03">Mar 2012</time>}
              description={
                <>
                  SCRUM team, produced operational and membership management
                  software for non-profits.
                </>
              }
            ></WorkExperience>
            <WorkExperience
              role="Software Engineer 3"
              orgName="MedSEEK"
              location="Birmingham, AL"
              from={<time dateTime="2011-02">Feb 2011</time>}
              to={<time dateTime="2011-08">Aug 2011</time>}
              description={
                <>
                  Improved e-healthcare platform, Coldstone; leveraged by
                  hospitals and healthcare providers.
                </>
              }
            ></WorkExperience>
            <WorkExperience
              role="Software Engineer 3"
              orgName="Intermark Interactive"
              location="Birmingham, AL"
              from={<time dateTime="2010-01">Jan 2010</time>}
              to={<time dateTime="2011-02">Feb 2011</time>}
              description={
                <>
                  Delivered features for high-profile BuyAToyota.com; handling
                  Toyota's third tier marketing.
                </>
              }
            ></WorkExperience>
            <WorkExperience
              role="Adjunct Faculty"
              orgName="Columbus Technical College"
              location="Columbus, GA"
              from={<time dateTime="2008-06">Jun 2008</time>}
              to={<time dateTime="2009-12">Dec 2009</time>}
              description={
                <>
                  Taught web development and general computing courses; ensuring
                  student preparedness for workforce.
                </>
              }
            ></WorkExperience>
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
      </Main>
    </>
  )
}

export default ResumeRoute
export { headers, loader, meta }
