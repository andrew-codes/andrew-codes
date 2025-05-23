import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import { Link as RemixLink } from "@remix-run/react"
import { FC, MouseEventHandler } from "react"

const CallToAction: FC<{
  primaryTitle?: string
  primaryAction?: string | MouseEventHandler
  secondaryTitle: string
  secondaryAction: string | MouseEventHandler
}> = ({
  primaryTitle = "View Resume",
  primaryAction = "/resume",
  secondaryAction,
  secondaryTitle,
}) => {
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ marginTop: 2 }}
      >
        {typeof primaryAction === "string" ? (
          <Button
            color="primary"
            variant="solid"
            href={primaryAction}
            component={"a"}
            size="lg"
          >
            {primaryTitle}
          </Button>
        ) : (
          <Button
            color="primary"
            variant="solid"
            onClick={primaryAction}
            size="lg"
          >
            {primaryTitle}
          </Button>
        )}
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
