import Box from "@mui/joy/Box"
import Divider from "@mui/joy/Divider"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import { FC, PropsWithChildren } from "react"

const PageHeader: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <Stack
        component="header"
        sx={{
          textAlign: "center",
        }}
        spacing={3}
      >
        <Box>
          <Typography
            level="h1"
            fontWeight={900}
            sx={(theme) => ({
              [theme.breakpoints.up("sm")]: {
                fontSize: "4rem",
              },
            })}
          >
            Andrew Smith
          </Typography>
          <Divider>
            <Typography
              level="body-lg"
              sx={(theme) => ({
                fontSize: "1.5rem",
                [theme.breakpoints.up("sm")]: {
                  fontSize: "2.25rem",
                  lineHeight: "3rem",
                  marginTop: `calc(-1 * ${theme.spacing(1)})`,
                },
              })}
            >
              Staff Software Engineer
            </Typography>
          </Divider>
        </Box>
        {children}
      </Stack>
      <Divider />
    </>
  )
}

export default PageHeader
