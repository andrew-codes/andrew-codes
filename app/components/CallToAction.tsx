import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import { Link as RemixLink } from "@remix-run/react"

const CallToAction = () => {
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ marginTop: 2 }}
      >
        <Button
          color="primary"
          variant="solid"
          to="/resume"
          component={RemixLink}
        >
          View My Resume
        </Button>
        <Button
          color="neutral"
          variant="outlined"
          component={RemixLink}
          to="/recommendations"
        >
          Read My Recommendations
        </Button>
      </Stack>
    </>
  )
}

export default CallToAction
