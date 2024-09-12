import { css, Global } from "@emotion/react"
import styled from "@emotion/styled"
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import type { FC } from "react"
import { Helmet } from "react-helmet"
import { fileURLToPath } from "url"
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
} from "../components/ContactCard"
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

const Main = styled.main`
  background-color: rgb(249, 251, 253);
  border-radius: 1rem;
  margin: 0 2rem;
  padding-top: 1rem;

  @media (max-width: 640px) {
    border-radius: 1rem 1rem 0 0;
    margin: 0;
    padding-top: 0.25rem;
  }

  @media print {
    background-color: transparent;
    margin: 0;
    padding: 0;
  }

  > * {
    margin: 0 auto;
  }
`

const globalStyles = css`
  body {
    @media print {
      background-color: transparent !important;
      padding: 0 !important;
    }
  }

  * {
    color: rgb(80, 80, 80);
    font-family: "Lato-Regular";
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
  margin-bottom: 1.5rem !important;
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
      <Helmet>
        <title>Resume | Andrew Smith</title>
      </Helmet>
      <Global styles={globalStyles} />
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
              <Email as={ResumeLink} href="mailto:jas@andrew.codes">
                jas@andrew.codes
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
                Empathetic software craftsmen engineering scalable software
                solutions for {yearsOfExperience}, delivering impactful customer
                experiences and mentoring teams of 3 to 50+ engineers.
              </Paragraph>
              <Section title="Highlights">
                <List>
                  <li>
                    Deep knowledge on the React ecosystem and delivering
                    high-quality experiences that delight customers; with a
                    focus on performance, accessibility and usability
                  </li>
                  <li>
                    Crafts comprehensive reports and visual presentations for
                    leadership translating technical terms, enabling informed
                    decision-making and strategic planning
                  </li>
                  <li>
                    Proficient with system languages and infrastructure;
                    including{" "}
                    <ResumeAbbr title="C sharp programming language">
                      C#
                    </ResumeAbbr>
                    , Node.js,{" "}
                    <ResumeAbbr title="Structured Query Language">
                      SQL
                    </ResumeAbbr>
                    , Kubernetes, containerization, git, Azure, bash and
                    PowerShell
                  </li>
                  <li>
                    Empower others by speaking, organizing, mentoring, and
                    contributing to OSS; including Gatsby, Cypress, Glamorous,
                    VS Code Grammarly, VersionOne SDKs, ReactATL and
                    Hacktoberfest events
                  </li>
                </List>
              </Section>
            </Notes>
          </ContactCard>
          <Section title="Recent Professional Experience">
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
                  Develop authoring tooling and content delivery for
                  support.microsoft.com, Office applications, and Windows.
                  Influential technical leadership and mentorship across 5
                  teams.
                </>
              }
              keyTechnologies={
                "TypeScript, React, Node.js, Next.js, Redux, GraphQL, Nx, C#, Azure, TDD, XP, git, Kanban"
              }
            >
              <List>
                <li>
                  Revamped the front-end architecture using React best
                  practices, leading to improved maintainability and scalability
                  for the application, supporting 2 billion users without
                  performance degradation
                </li>
                <li>
                  Championed the optimization of existing React components and
                  federated{" "}
                  <ResumeAbbr title="Graph Query Language">GraphQL</ResumeAbbr>,
                  resulting in a 90% reduction in key user-facing performance
                  metrics, facilitating smoother navigation for users improving
                  user satisfaction scores by 25%
                </li>
                <li>
                  Initiated a quality culture shift within the organization by
                  introducing TDD and XP principles with Jest and Cypress
                  testing; this foundational change reduced support costs by 30%
                </li>
                <li>
                  Reduce cost of creating and communicating project timelines to
                  leadership by ~95% by engineering an open source forecasting
                  tool, leveraging{" "}
                  <ResumeAbbr title="Artificial Intelligence">AI</ResumeAbbr>{" "}
                  and historical data without requiring estimates
                </li>
                <li>
                  Reduce{" "}
                  <ResumeAbbr title="Continuous integration automation">
                    CI
                  </ResumeAbbr>{" "}
                  times by 80% by improving reliability with Yarn{" "}
                  <ResumeAbbr title="Plug and Play">PnP</ResumeAbbr>, reducing
                  complexity via Nx, and consolidating into a mono-repository
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
                  Guided all aspects of front-end development for 3 teams,
                  communicated with stakeholders and executive leadership,
                  ensured experiences that delight customers.
                </>
              }
              keyTechnologies={
                "TypeScript, React, Node.js, Redux, TDD, Jest, Cypress, Docker, AWS, microservices, git, Scrum"
              }
            >
              <List>
                <li>
                  Innovated a comprehensive design language for UI components in
                  the React ecosystem, ensuring consistent design across the
                  application and accelerate delivery of new features
                </li>
                <li>
                  Established "Three Amigos" process driving improved alignment
                  and visibility with product/leadership of delivered value;
                  with 75% reduction of engineering time investment, increased
                  team velocity by 20%
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
                "JavaScript, React, Redux, AngularJs, Backbone.JS, jQuery, C#, MVC.NET, Node.js, TDD, XP, gulp, git, Kanban"
              }
            >
              <List>
                <li>
                  Led modernization effort of entire front-end codebase
                  replacing proprietary JavaScript module format with{" "}
                  <ResumeAbbr title="EcmaScript 6 (JavaScript version)">
                    ES6
                  </ResumeAbbr>{" "}
                  modules; enabled use of modern tooling and practices, adoption
                  of React, significant reduction of technical debt and
                  increased developer productivity
                </li>
                <li>
                  Implemented a systematic migration to React, resulting in a
                  streamlined development process adopted by 5 teams across 2
                  key products, enhancing productivity and consistency
                </li>
                <li>
                  Streamlined processes between UX and Engineering through the
                  creation of React based component library and design language
                  documentation; tested via Cypress and Storybook
                </li>
                <li>
                  Owned high-impact{" "}
                  <ResumeAbbr title="Open source software">OSS</ResumeAbbr>{" "}
                  JavaScript SDK used by third party integrations; driving many
                  internal business processes of Fortune 500 companies
                </li>
                <li>
                  Led a series of workshops and presentations focused on the
                  React ecosystem, delivered both internally and at major
                  conferences, providing guidance and mentorship to engineers
                  and leadership
                </li>
              </List>
            </WorkExperience>
          </Section>
          <Section title="Professional Experience (continued)">
            <WorkExperience
              summarized
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
                "C#, MVC.NET, PHP, Node.js, JavaScript, React, jQuery, KnockoutJS, TDD, Jasmine, Karma, MSTest, Scrum, grunt, git"
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
              summarized
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
              summarized
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
              summarized
              role="Senior Software Engineer"
              orgName="DAXKO"
              location="Birmingham, AL"
              from={<time dateTime="2011-08">Aug 2011</time>}
              to={<time dateTime="2012-03">Mar 2012</time>}
              description={
                <>
                  Scrum team, produced operational and membership management
                  software for non-profits.
                </>
              }
            ></WorkExperience>
            <WorkExperience
              summarized
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
              summarized
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
              summarized
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
    </>
  )
}

export default ResumeRoute
export { headers, loader }
