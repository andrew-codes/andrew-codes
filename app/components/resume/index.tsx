import type { FC, ReactNode } from "react"
import styled from "styled-components"

const Resume = styled.div`
  position: relative;
  @media print {
    height: unset !important;
    margin: 0 !important;
  }

  > * {
    margin: 16pt auto 0 auto;
  }
  > :first-child {
    margin-top: 0.5in;

    @media print {
      margin-top: 0 !important;
    }
  }
  > :last-child {
    margin-bottom: 0.5in;

    @media print {
      margin-bottom: 0 !important;
    }
  }
`

const Paragraph = styled.p`
  @media print {
  }
`
const List = styled.ul`
  margin: 8pt 16pt 0 0 !important;
  padding: 0 0 0 32pt !important;

  > li {
    margin-top: 4pt;
  }

  > li:first-child {
    margin-top: 0;
  }
`
const Note = styled.span`
  font-size: 9pt;
  font-style: italic;
`
const SectionRoot = styled.section`
  > *:nth-child(n + 2) {
    margin-top: 15pt;
  }
  > *:nth-child(2) {
    margin-top: 0;
  }
`
const SectionTitle = styled.h2`
  border-bottom: 1px solid rgb(198, 198, 198);
  color: rgb(81, 104, 173);
  font-size: 14pt;
  font-variant: all-small-caps;
  margin: 0;
  margin-bottom: 8pt;
  padding-bottom: 8pt;
`
const Section: FC<{ children: ReactNode | ReactNode[]; title: string }> = ({
  children,
  title,
}) => {
  return (
    <SectionRoot>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </SectionRoot>
  )
}

const WorkExperienceRoot = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`
const JobTitle = styled.h3`
  display: inline-block;
  flex: 1;
  font-family: "Lato-Bold";
  font-size: 14pt;
  margin: 0;
  min-width: 50%;
`
const TimeFrame = styled.span`
  display: inline-block;
`
const OrgName = styled.span`
  display: block;
  flex: 1;
  font-size: 13pt;
  margin-right: 2pt;
  min-width: 70%;
`
const Location = styled.span`
  display: inline-block;
`
const KeyResults = styled.div`
  margin-top: 8pt;
  width: 100%;
`
const WorkExperience: FC<{
  children: ReactNode | ReactNode[]
  from: string | ReactNode
  role: string
  location: string | ReactNode
  note?: string | ReactNode
  orgName: string
  to: string | ReactNode
}> = ({ children, role, location, note, orgName, from, to }) => {
  return (
    <WorkExperienceRoot>
      <JobTitle>{role}</JobTitle>
      <TimeFrame>
        {!!note && <Note>({note})</Note>} {from} - {to}
      </TimeFrame>
      <OrgName>{orgName}</OrgName>
      <Location>{location}</Location>
      <KeyResults>{children}</KeyResults>
    </WorkExperienceRoot>
  )
}

const EducationRoot = styled.div`
  display: flex;
  flex-wrap: wrap;

  > *:nth-child(3) {
    display: inline-block;
    min-width: 70%;
  }
  > *:nth-child(4) {
    display: inline-block;
    flex: 1;
    text-align: right;
    margin-right: 2pt;
  }
  > *:nth-child(n + 3) {
    :after {
      content: ", ";
    }
  }
  > *:last-child {
    :after {
      content: "";
    }
  }
`
const Degree = styled.h3`
  display: inline-block;
  flex: 1;
  font-family: "Lato-Bold";
  font-size: 14pt;
  margin: 0;
  min-width: 70%;
`
const Education: FC<{
  schoolName: string
  degree: string
  locality: string | ReactNode
  region: string | ReactNode
  obtainedOn: string | ReactNode
}> = ({ schoolName, degree, locality, obtainedOn, region }) => {
  return (
    <EducationRoot>
      <Degree>{degree}</Degree>
      <span>{obtainedOn}</span>
      <span>{schoolName}</span>
      <span>{locality}</span>
      <span>{region}</span>
    </EducationRoot>
  )
}

const SummarizedItemRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  > *:nth-child(1) {
    flex: 1;
  }
`
const SummarizedItemName = styled.h3`
  display: inline-block;
  font-family: "Lato-Bold";
  font-size: 12pt;
  margin: 0;
`

const SummarizedItem: FC<{
  name: string
  note?: string | ReactNode
  on?: string | ReactNode
  role: string
}> = ({ note, name, on, role }) => {
  return (
    <SummarizedItemRoot>
      <SummarizedItemName>
        {role} - {name}
      </SummarizedItemName>
      {!!on && (
        <span>
          {!!note && <Note>({note})</Note>} {on}
        </span>
      )}
    </SummarizedItemRoot>
  )
}
const SummarizedItems = styled.div`
  > * {
    margin-top: 0;
  }
`
const Strong = styled.strong`
  font-family: "Lato-Bold";
`

const ToDo = styled.div`
  background: pink;
  display: inline-block;
  position: relative;

  ::after {
    content: "";
    height: 100%;
    left: -2px;
    position: absolute;
    top: -2px;
    width: 100%;
    border: 2px solid red;
  }
`

const PaginatedResume = styled(Resume)`
  > * {
    page-break-before: always;
  }

  > * :last-child {
    page-break-before: unset;
  }
`
const Page = styled.div`
  background: rgb(255, 255, 255);
  border: 1px solid rgb(198, 198, 198);
  height: 11in;
  padding: 0.5in;
  width: 8.5in;

  > section {
    margin-top: 16pt;
  }
  > section:first-child {
    margin-top: 0;
  }

  @media print {
    border: none;
    height: unset;
    padding: 0;
    width: unset;
  }
`

export * from "./ContactInformation"
export {
  SummarizedItem,
  SummarizedItems,
  Education,
  List,
  Page,
  PaginatedResume,
  Paragraph,
  Resume,
  Section,
  Strong,
  ToDo,
  WorkExperience,
}
