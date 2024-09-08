import type { FC, PropsWithChildren, ReactNode } from "react"
import styled from "styled-components"
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
const WorkExperience: FC<
  PropsWithChildren<{
    description: string | ReactNode
    keyTechnologies?: string | ReactNode
    from: string | ReactNode
    role: string
    location: string | ReactNode
    note?: string | ReactNode | undefined
    orgName: string
    summarized?: boolean | undefined
    to: string | ReactNode
  }>
> = ({
  children,
  role,
  location,
  note,
  orgName,
  from,
  to,
  description,
  keyTechnologies,
  summarized,
}) =>
  !summarized ? (
    <WorkExperienceRoot>
      <WorkExperienceOverview>
        <JobTitle>{role}</JobTitle>
        <TimeFrame>
          {note && <Note>({note})</Note>} {from} - {to}
        </TimeFrame>
        <OrgName>{orgName}</OrgName>
        <Location>{location}</Location>
        <Description>{description}</Description>
        {keyTechnologies && (
          <KeyTechnologies>{keyTechnologies}</KeyTechnologies>
        )}
      </WorkExperienceOverview>
      {children && <KeyResults>{children}</KeyResults>}
    </WorkExperienceRoot>
  ) : (
    <SummarizedWorkExperienceRoot role={role} orgName={orgName}>
      <TimeFrame>
        {note && <Note>({note})</Note>} {from} - {to}
      </TimeFrame>
    </SummarizedWorkExperienceRoot>
  )

const SummarizedTechnologies = styled(KeyTechnologies)`
  display: inline-block !important;
  width: unset !important;
  margin: 0;
`

const SummarizedWorkExperienceRoot: FC<
  PropsWithChildren<{
    role: string | ReactNode
    orgName: string | ReactNode
  }>
> = ({ children, role, orgName }) => {
  return (
    <WorkExperienceRoot>
      <WorkExperienceOverview>
        <SummarizedItemRoot>
          <SummarizedItemName>
            {role} - {orgName}
          </SummarizedItemName>
          <SummarizedTechnologies>{children}</SummarizedTechnologies>
        </SummarizedItemRoot>
      </WorkExperienceOverview>
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
  width: 100%;
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
  position: relative;
  width: 8.5in;

  > section {
    margin-top: 16pt;
  }

  > section:first-child {
    margin-top: 0;
  }

  @media (max-width: 640px) {
    padding: 1rem;
    border: none;
    height: unset;
  }

  @media (max-width: 890px) {
    width: 100%;
    border: none;
  }
`

export * from "./ContactInformation"
export {
  SummarizedItem,
  SummarizedItems,
  Education,
  List,
  Page,
  Paragraph,
  Resume,
  Section,
  Strong,
  ToDo,
  WorkExperience,
}
