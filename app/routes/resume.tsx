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
    margin: 0;
    padding: 0;
  }

  > * {
    margin: 0 auto;
    color: rgb(80, 80, 80);
    font-family: "Lato-Regular";
    font-size: 12pt;
  }
`

const globalStyles = css`
  body {
    @media print {
      background-color: transparent !important;
      padding: 0 !important;
    }
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
      <Root>
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
                  solutions for {yearsOfExperience} years, delivering impactful
                  customer experiences and mentoring teams of engineers.
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
                    Designed and implemented a scalable front-end architecture
                    using React.js and Next.js, ensuring seamless performance
                    under a load of 500M monthly requests and 2B+ users
                    worldwide
                  </li>
                  <li>
                    Spearheaded cross-team collaboration among 3 engineering
                    teams to develop a federated{" "}
                    <ResumeAbbr title="Graph Query Language">
                      GraphQL
                    </ResumeAbbr>{" "}
                    <ResumeAbbr title="application programming interface">
                      API
                    </ResumeAbbr>
                    , reducing user-facing latency by 90% and boosting
                    satisfaction scores by 25%
                  </li>
                  <li>
                    Championed{" "}
                    <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                    and <ResumeAbbr title="Extreme programming">XP</ResumeAbbr>{" "}
                    principles across engineering teams, mentoring developers on{" "}
                    <ResumeAbbr title="end-to-end">E2E</ResumeAbbr> and
                    component testing using Cypress, which cut support costs by
                    30% and enhanced code reliability
                  </li>
                  <li>
                    Developed an open-source{" "}
                    <ResumeAbbr title="Artificial Intelligence">AI</ResumeAbbr>{" "}
                    -driven forecasting tool to eliminate manual estimates,
                    improving project timeline communication to leadership by
                    95% and streamlining decision-making processes
                  </li>
                  <li>
                    Optimized{" "}
                    <ResumeAbbr title="Continuous integration automation">
                      CI
                    </ResumeAbbr>{" "}
                    pipeline efficiency by 80% through Yarn{" "}
                    <ResumeAbbr title="Plug and Play">PnP</ResumeAbbr>{" "}
                    integration, simplifying dependency management with Nx, and
                    centralizing codebases into a mono-repository, reducing
                    operational overhead
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
                  "TypeScript, React.js, Node.js, Redux, TDD, Jest, Cypress, Docker, microservices, AWS, git, Scrum"
                }
              >
                <List>
                  <li>
                    Designed a modular React.js-based UI component library,
                    standardizing design language across 3 applications and
                    accelerating feature delivery timelines
                  </li>
                  <li>
                    Mentored 3 cross-functional teams on React.js, Redux, and{" "}
                    <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                    practices, fostering improved team productivity
                  </li>
                  <li>
                    Pioneered the “Three Amigos” collaboration model, aligning
                    engineering, product, and leadership teams, which reduced
                    time investment by 75% and boosted team velocity by 20%
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
                    Directed front-end modernization by transitioning
                    proprietary JavaScript to{" "}
                    <ResumeAbbr title="EcmaScript 6 (JavaScript version)">
                      ES6
                    </ResumeAbbr>{" "}
                    modules, reducing technical debt by 30% and increasing
                    developer productivity by 40%
                  </li>
                  <li>
                    Aligned engineering organization to adopt React.js for new
                    major features, resulting in a streamlined development
                    process adopted by 5 teams across 2 key products, enhancing
                    productivity and consistency
                  </li>
                  <li>
                    Developed a React.js-based component library and design
                    documentation, adopted by 4 teams, improving collaboration
                    with UX team and ensuring UX consistency across products
                  </li>
                  <li>
                    Owned high-impact{" "}
                    <ResumeAbbr title="Open source software">OSS</ResumeAbbr>{" "}
                    JavaScript SDK used by third party integrations; driving
                    many internal business processes of Fortune 500 companies
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
                    Redesigned a major e-commerce checkout process, reducing
                    user steps by 50% and enhancing the overall UX, contributing
                    to a measurable increase in conversion rates
                  </li>
                  <li>
                    Implemented comprehensive testing frameworks (Jasmine,
                    Mocha, and Karma) with CI automation via Gulp and Grunt,
                    reducing feature defects by ~60% and significantly enhancing
                    product quality
                  </li>
                </List>
              </WorkExperience>
            </Section>
            <Section title="Professional Experience (continued)">
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
                    Taught web development and general computing courses;
                    ensuring student preparedness for workforce.
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
      </Root>
    </>
  )
}

export default ResumeRoute
export { headers, loader }
