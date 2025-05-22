import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import { Link as RemixLink } from "@remix-run/react"
import { FC, MouseEventHandler } from "react"

const CallToAction: FC<{
  secondaryTitle: string
  secondaryAction: string | MouseEventHandler
}> = ({ secondaryAction, secondaryTitle }) => {
  if (typeof secondaryAction === "string") {
  }

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
          size="lg"
        >
          View Resume
        </Button>
        {typeof secondaryAction === "string" ? (
          <Button
            color="neutral"
            variant="outlined"
            component={RemixLink}
            to={secondaryAction}
            size="lg"
          >
            {secondaryTitle}
          </Button>
        ) : (
          <Button
            color="neutral"
            variant="outlined"
            size="lg"
            onClick={secondaryAction}
          >
            {secondaryTitle}
          </Button>
        )}
      </Stack>
    </>
  )
}

export default CallToAction
