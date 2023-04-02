import type { FC, ReactNode } from "react"
import styled from "styled-components"

const Resume = styled.div`
  height: 22in;
  margin: 0.5in auto 0 auto !important;
  position: relative;
  width: 8.5in;
  @media print {
    background-color: rgb(255, 255, 255);
    height: unset !important;
    margin: 0 !important;
  }

  > * {
    margin: 16pt 0.5in 0 0.5in;
  }
  > :first-child {
    margin-top: 0.5in;
  }
  > :last-child {
    margin-bottom: 0.5in;
  }

  :before {
    border: 1px solid rgb(198, 198, 198);
    z-index: -1;
    background-color: rgb(255, 255, 255);
    content: "";
    position: absolute;
    width: 8.5in;
    height: 11in;
    top: -0.5in;
    @media print {
      display: none !important;
    }
  }

  :after {
    border: 1px solid rgb(198, 198, 198);
    background-color: rgb(255, 255, 255);
    content: "";
    position: absolute;
    width: 8.5in;
    height: 11in;
    top: 11in;
    @media print {
      display: none !important;
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
`
const Main = styled.main`
  > section {
    margin-top: 16pt;
  }
  > section:first-child {
    margin-top: 0;
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
  margin: 0;
  color: rgb(81, 104, 173);
  font-variant: all-small-caps;
  padding-bottom: 8pt;
  margin-bottom: 8pt;
  border-bottom: 1px solid rgb(198, 198, 198);
  font-size: 14pt;
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
  > :first-child {
    ::after {
    }
  }

  > :nth-child(3) {
    ::after {
      content: ",";
      display: inline-block;
    }
  }
`
const JobTitle = styled.h3`
  margin: 0;
  display: inline-block;
  flex: 1;
  min-width: 70%;
  font-family: "Lato-Bold";
  font-size: 14pt;
`
const TimeFrame = styled.span`
  display: inline-block;
`
const OrgName = styled.span`
  display: block;
  font-size: 13pt;
  margin-right: 2pt;
`
const Location = styled.span`
  display: inline-block;
  flex: 1;
  min-width: 80%;
`
const KeyResults = styled.div`
  width: 100%;
  margin-top: 8pt;
`
const WorkExperience: FC<{
  jobTitle: string
  orgName: string
  location: string | ReactNode
  from: string | ReactNode
  to: string | ReactNode
  children: ReactNode | ReactNode[]
}> = ({ children, jobTitle, location, orgName, from, to }) => {
  return (
    <WorkExperienceRoot>
      <JobTitle>{jobTitle}</JobTitle>
      <TimeFrame>
        {from} - {to}
      </TimeFrame>
      <OrgName>{orgName}</OrgName>
      <Location>{location}</Location>
      <KeyResults>{children}</KeyResults>
    </WorkExperienceRoot>
  )
}

const Strong = styled.strong`
  font-family: "Lato-Bold";
`

export * from "./ContactInformation"
export { List, Main, Paragraph, Resume, Section, Strong, WorkExperience }
