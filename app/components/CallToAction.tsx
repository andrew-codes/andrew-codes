import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import { Link as RemixLink } from "@remix-run/react"
import { FC, MouseEventHandler } from "react"

const CallToAction: FC<{
  primaryTitle?: string
  primaryAction?: string | MouseEventHandler
  secondaryTitle: string
  secondaryAction: string | MouseEventHandler
  tertiaryTitle?: string
  tertiaryAction?: string | MouseEventHandler
}> = ({ primaryTitle, primaryAction, secondaryAction, secondaryTitle, tertiaryTitle, tertiaryAction }) => {
  const handlePrimaryAction = (evt) => {
    if (typeof primaryAction === "function") {
      primaryAction(evt)
    }
  }

  const handleSecondaryAction = (evt) => {
    if (typeof secondaryAction === "function") {
      secondaryAction(evt)
    }
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
        {!primaryAction ? (
          <Button
            color="primary"
            variant="solid"
            href={encodeURI("/James Andrew Smith - Resume.pdf")}
            component="a"
            size="lg"
          >
            Download Resume
          </Button>
        ) : typeof primaryAction === "string" ? (
          <Button
            color="primary"
            variant="solid"
            to={primaryAction}
            component={RemixLink}
            size="lg"
          >
            {primaryTitle}
          </Button>
        ) : (
          <Button
            color="primary"
            variant="solid"
            onClick={handlePrimaryAction}
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
            onClick={handleSecondaryAction}
          >
            {secondaryTitle}
          </Button>
        )}
        {tertiaryTitle && tertiaryAction && (
          typeof tertiaryAction === "string" ? (
            <Button
              color="neutral"
              variant="outlined"
              component={RemixLink}
              to={tertiaryAction}
              size="lg"
            >
              {tertiaryTitle}
            </Button>
          ) : (
            <Button
              color="neutral"
              variant="outlined"
              size="lg"
              onClick={tertiaryAction as MouseEventHandler}
            >
              {tertiaryTitle}
            </Button>
          )
        )}
      </Stack>
    </>
  )
}

export default CallToAction
