import styled from "@emotion/styled"
import type { FC, ReactNode } from "react"
import Paper from "../Paper"
import { PrintTogether } from "../print"

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
    @media print {
      margin-top: 0 !important;
    }
  }
  > :last-child {
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

  @media (max-width: 640px) {
    padding-left: 2rem !important;
  }
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
  margin-bottom: 4pt;
  padding-bottom: 4pt;
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
const WorkExperienceOverview = styled(PrintTogether)`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
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
const Description = styled.p`
  margin-top: 8pt;
  width: 100%;
`
const KeyTechnologies = styled.p`
  font-size: 0.875rem;
  font-style: italic;
  margin-top: 8pt;
  text-align: right;
  width: 100%;
`
const KeyResults = styled.div`
  margin-top: 8pt;
  width: 100%;
`
const WorkExperienceSummaryRoot = styled(WorkExperienceRoot)`
  margin: 0 !important;

  h3 {
    font-size: 12pt;
    max-width: calc(100% - 160px);
    min-width: unset;
    width: 100%;
    flex: unset;
  }

  h3 + span {
    text-align: right;
    flex: 1;
    display: inline-flex;

    time {
      flex: 1;
      text-align: left;
    }

    time:nth-child(1) {
    }

    time + time {
      text-align: right;
    }
  }
`

const WorkExperience: FC<{
  children?: ReactNode | ReactNode[]
  description: string | ReactNode
  keyTechnologies?: string | ReactNode
  from: string | ReactNode
  role: string
  location: string | ReactNode
  orgName: string
  summarized?: boolean | undefined
  to: string | ReactNode
}> = ({
  children,
  description,
  from,
  keyTechnologies,
  location,
  orgName,
  role,
  summarized,
  to,
}) => {
  return !summarized ? (
    <WorkExperienceRoot>
      <WorkExperienceOverview>
        <JobTitle>{role}</JobTitle>
        <TimeFrame>
          {from} - {to}
        </TimeFrame>
        <OrgName>{orgName}</OrgName>
        <Location>{location}</Location>
        <Description>{description}</Description>
        {!!keyTechnologies && (
          <KeyTechnologies>{keyTechnologies}</KeyTechnologies>
        )}
      </WorkExperienceOverview>
      {!!children && <KeyResults>{children}</KeyResults>}
    </WorkExperienceRoot>
  ) : (
    <WorkExperienceSummaryRoot>
      <JobTitle>
        {role} - {orgName}
      </JobTitle>
      <TimeFrame>
        {from} - {to}
      </TimeFrame>
    </WorkExperienceSummaryRoot>
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
  > *:nth-child(n + 4)::after {
    content: ", ";
  }

  > *:last-child::after {
    content: "";
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
      {!!on && <span>{on}</span>}
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
    border: 2px solid red;
    content: "";
    height: 100%;
    left: -2px;
    position: absolute;
    top: -2px;
    width: 100%;
  }
`

const Page = styled(Paper)`
  border-radius: 0;
  padding: 1.5rem;
  position: relative;
  width: 100%;

  > section {
    margin-top: 16pt;
  }
  > section:first-child {
    margin-top: 0;
  }

  @media print {
    background-color: transparent !important;
    border: none;
    height: unset;
    padding: 0;
    width: unset;
  }

  @media (max-width: 640px) {
    border: none;
    height: unset;
    padding: 1rem;
    width: unset;
  }

  @media (max-width: 390px) {
    padding: 1rem;
  }
`

export * from "./ContactInformation"
export {
  Education,
  List,
  Page,
  Paragraph,
  Resume,
  Section,
  Strong,
  SummarizedItem,
  SummarizedItems,
  ToDo,
  WorkExperience,
}
