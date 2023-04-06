import styled from "styled-components"

const Page = styled.div`
  background: rgb(255, 255, 255);
  border: 1px solid rgb(198, 198, 198);
  padding: 0.5in;

  @media print {
    border: none;
    padding: 0;
  }
`

export default Page
