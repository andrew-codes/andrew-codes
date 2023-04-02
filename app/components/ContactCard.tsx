import type { FC, HTMLProps, ReactNode } from "react"
import { Children } from "react"
import styled from "styled-components"
import SmallContentDivider from "./SmallContentDivider"

type WrappedStyledComponent<Props = {}> = FC<
  {
    as?: string | React.ComponentType<any>
    children: ReactNode | ReactNode[]
  } & Props
>

const ContactCardStyled = styled.header``
const ContactCard: WrappedStyledComponent = ({ as, children }) => (
  <ContactCardStyled as={as} className="vcard">
    {children}
  </ContactCardStyled>
)

const FullNameStyled = styled.h1``
const FullName: WrappedStyledComponent = ({ as, children }) => (
  <FullNameStyled as={as} className="fn">
    {children}
  </FullNameStyled>
)

const JobTitleStyled = styled.span``
const JobTitle: WrappedStyledComponent = ({ as, children }) => (
  <JobTitleStyled as={as} className="title">
    {children}
  </JobTitleStyled>
)

const ContactInformationStyled = styled.div``

const ContactInformation: WrappedStyledComponent = ({ as, children }) => (
  <ContactInformationStyled as={as}>
    <>
      {Children.map(children, (child, index) => {
        if (index === 0) {
          return child
        }

        return (
          <>
            <SmallContentDivider />
            {child}
          </>
        )
      })}
    </>
  </ContactInformationStyled>
)

const AddressStyled = styled.address``
const Address: WrappedStyledComponent = ({ as, children }) => (
  <AddressStyled as={as} className="address">
    {children}
  </AddressStyled>
)

const Abbr = styled.abbr``
const Text = styled.span``
const Locality: WrappedStyledComponent = ({ as, children }) => (
  <Text as={as} className="locality">
    {children}
  </Text>
)
const Region: WrappedStyledComponent<{ title: string }> = ({
  as,
  children,
  title,
}) => (
  <Abbr as={as} className="region" title={title}>
    {children}
  </Abbr>
)

const Link = styled.a``
const Email: WrappedStyledComponent<HTMLProps<HTMLAnchorElement>> = ({
  as,
  children,
  ...props
}) => (
  <Link as={as} className="email" {...props}>
    {children}
  </Link>
)
const Telephone: WrappedStyledComponent<HTMLProps<HTMLAnchorElement>> = ({
  as,
  children,
  ...props
}) => (
  <Link as={as} className="tel" {...props}>
    {children}
  </Link>
)
const Url: WrappedStyledComponent<HTMLProps<HTMLAnchorElement>> = ({
  as,
  children,
  ...props
}) => (
  <Link as={as} className="url" {...props}>
    {children}
  </Link>
)

const NotesStyled = styled.div``
const Notes: WrappedStyledComponent = ({ as, children }) => (
  <NotesStyled as={as} className="note">
    {children}
  </NotesStyled>
)

export {
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
}
