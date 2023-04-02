import type { FC } from "react"
import { createGlobalStyle } from "styled-components"
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
  ResumeAddress,
  ResumeContactCard,
  ResumeContactInformation,
  ResumeFullName,
  ResumeJobTitle,
  ResumeAbbr,
  ResumeNotes,
  ResumeLink,
  Section,
  WorkExperience,
  Strong,
} from "~/components/resume"
import { List, Main, Paragraph, Resume } from "~/components/resume"

const GlobalStyles = createGlobalStyle`
    body {
        background-color: rgb(249,251,253) !important;
        padding: 0.5in 0 !important;
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

const ResumeRoute: FC<{}> = () => {
  const yearsOfExperience =
    new Date(Date.now() - new Date(2008, 1, 1).getTime()).getFullYear() - 1970

  return (
    <>
      <GlobalStyles />
      <Resume>
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
              Senior engineer at Microsoft with{" "}
              <Strong>{yearsOfExperience} years</Strong> of full-stack
              development experience and expert knowledge of the React
              ecosystem. A few career highlights:
            </Paragraph>
            <List>
              <li>
                Accurate roadmap feasibility analysis and release confidence by
                creating a forecasting tool; no estimates needed, only story
                completion dates;{" "}
                <ResumeLink href="https://github.com/andrew-codes/forecast-work">
                  github.com/andrew-codes/forecast-work
                </ResumeLink>
              </li>
            </List>
          </Notes>
        </ContactCard>
        <Main>
          <Section title="Work Experience">
            <WorkExperience
              jobTitle="Senior Software Engineer (64)"
              orgName="Microsoft"
              location="Atlanta, GA (Remote)"
              from={<time dateTime="2019-06">June 2019</time>}
              to={<time dateTime="2020-12">Dec 2020</time>}
            >
              <Paragraph>TODO: Add summary</Paragraph>
              <List>
                <li>
                  Improve key user read performance metrics by 45% to meet
                  company{" "}
                  <ResumeAbbr title="Object key results">OKR</ResumeAbbr>{" "}
                  through design and execution of{" "}
                  <ResumeAbbr title="Command Query Responsibility Segregation">
                    CQRS
                  </ResumeAbbr>{" "}
                  with GraphQL; exhibited technical leadership to drive adoption
                  of GraphQL across 3 teams
                </li>
                <li>
                  Technical leadership in React, TypeScript, Redux, federated
                  GraphQL, Nx, Micro-service architecture,{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>{" "}
                  and pair-programming practices; mentored 5 junior and senior
                  engineers
                </li>
                <li>
                  Instill a culture of quality by introducing React/TypeScript
                  testing via Jest and Cypress; advocate for pragmatic{" "}
                  <ResumeAbbr title="Test-driven development">TDD</ResumeAbbr>;
                  increasing test coverage from 0% to 45%
                </li>
              </List>
            </WorkExperience>
            <WorkExperience
              jobTitle="Lead Front-End Engineer"
              orgName="Experience, LLC"
              location="Atlanta, GA (Remote)"
              from={<time dateTime="2019-06">June 2019</time>}
              to="present"
            >
              <Paragraph>TODO: Add summary</Paragraph>
              <List>
                <li>
                  Accelerate engineering efforts with a consistent UX design
                  language backed by a component library
                </li>
                <li>
                  Significantly decrease missed requirements through instituting
                  "Three Amigos"
                </li>
                <li>
                  Improve release confidence through technical insights,
                  guidance, and leadership of staff to create E2E tests.
                </li>
              </List>
            </WorkExperience>
          </Section>
        </Main>
      </Resume>
    </>
  )
}

export default ResumeRoute
