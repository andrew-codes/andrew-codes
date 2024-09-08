import type { FC } from "react"
import styled from "styled-components"
import avatar from "../images/Profile400px.png"
import {
  ContactCard,
  ContactInformation,
  FullName,
  JobTitle,
  Url,
} from "./ContactCard"
import Link from "./Link"

const Image = styled.img`
  border: 2px solid rgb(255, 255, 255);
  border-radius: 50%;
  margin: 1rem;
  max-height: 5rem;
  min-height: 2rem;

  @media (max-width: 640px) {
    margin-left: 0.25rem;
  }
`
const ProfileInformation = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
`

const ProfileName = styled.h1`
  margin: 0;
  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`
const ProfileSummary = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: left;
`
const HeaderBoundary = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;

  > * {
    margin: 0 4rem;

    @media (max-width: 640px) {
      margin: 0 0.5rem;
    }
  }
`
const Header = styled.header`
  background-color: rgb(34, 35, 39);
  width: 100%;
  display: flex;

  * {
    color: rgb(255, 255, 255);
  }

  @media print {
    display: none;
  }
`

const NavLink = styled(Link)`
  display: inline-block;
`

const Nav = styled.nav`
  align-items: center;
  align-self: flex-end;
  display: flex;
  flex: 1;
  justify-content: flex-end;

  > ${NavLink} {
    font-size: 1.5rem;
    font-variant: all-small-caps;
    margin: 0 1.5rem 1.5rem;
  }
`

const GlobalNavImpl: FC<{}> = (props) => (
  <Header {...props}>
    <HeaderBoundary>
      <ContactCard as={ProfileSummary}>
        <ProfileInformation>
          <FullName as={ProfileName}>James Andrew Smith</FullName>
          <JobTitle>Senior Software Engineer</JobTitle>
          <ContactInformation>
            <Url href="https://linkedin.com/in/JamesAndrewSmith">LinkedIn</Url>
            <Url href="https://github.com/andrew-codes">
              andrew-codes (github)
            </Url>
          </ContactInformation>
        </ProfileInformation>
        <Image src={avatar} alt="Profile of Andrew Smith" />
      </ContactCard>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/resume">Resume</NavLink>
      </Nav>
    </HeaderBoundary>
  </Header>
)

const GlobalNav = styled(GlobalNavImpl)``

export default GlobalNav
