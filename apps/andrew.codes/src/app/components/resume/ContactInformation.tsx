import styled from "styled-components"

const ResumeContactCard = styled.header`
  > .note {
    margin-top: 12pt !important;
  }
`

const ResumeFullName = styled.h1`
  color: rgb(81, 104, 173);
  font-family: "Lato-Regular";
  font-size: 20pt;
  font-weight: 800;
  margin: 0;
  @media print {
    color: rgb(0, 0, 0);
  }
`

const ResumeJobTitle = styled.span`
  display: block;
  font-family: "Lato-Regular";
  font-size: 14pt;
`

const ResumeContactInformation = styled.div`
  * {
    font-family: "Lato-Regular";
    font-size: 9pt;
    font-style: normal;
    font-weight: 550;
  }
`

const ResumeAddress = styled.address`
  display: inline-block;

  @media print {
    font-style: normal;
  }
`
const ResumeAbbr = styled.abbr`
  @media print {
    text-decoration: none;
  }
`

const ResumeLink = styled.a`
  color: unset;
  text-decoration: none;
`

const ResumeNotes = styled.div`
  > *:first-child {
    margin-top: 0 !important;
  }

  > * {
    margin-top: 12pt !important;
  }
`

export {
  ResumeAddress,
  ResumeContactCard,
  ResumeContactInformation,
  ResumeFullName,
  ResumeJobTitle,
  ResumeNotes,
  ResumeLink,
  ResumeAbbr,
}
