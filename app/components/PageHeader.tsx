import Box from "@mui/joy/Box"
import Typography from "@mui/joy/Typography"
import { FC, PropsWithChildren } from "react"

const PageHeader: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Box
      component="header"
      sx={{
        textAlign: "center",
      }}
    >
      <Typography level="h1" fontSize="xl6" fontWeight={900}>
        Andrew Smith
      </Typography>
      <Typography level="body-lg" fontSize="xl2">
        Staff Software Engineer
      </Typography>
      <Typography level="body-md">
        I create robust, scalable applications and drive engineering teams.
      </Typography>
      {children}
    </Box>
  )
}

export default PageHeader
