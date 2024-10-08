import styled from "@emotion/styled"

const Paper = styled.div`
  background-color: rgb(249, 251, 253);
  border: 1px solid rgb(198, 198, 198);
  border-radius: 1rem;
  padding: 1.5rem;

  @media (max-width: 640px) {
    margin: 0;
    padding-bottom: 0.5rem !important;
  }

  @media print {
    border: none;
    padding: 0;
  }
`

export default Paper
