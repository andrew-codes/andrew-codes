import styled from "@emotion/styled"

const MobileOnly = styled.div`
  @media (min-width: 641px) {
    display: none;
  }
`

const NotMobileOnly = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`

const PrintOnly = styled.div`
  @media screen {
    display: none;
  }
`

export { MobileOnly, NotMobileOnly, PrintOnly }
