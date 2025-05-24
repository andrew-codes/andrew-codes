import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import { Link as RemixLink } from "@remix-run/react"
import { FC, MouseEventHandler } from "react"
import useAnalytics from "../libs/useAnalytics"

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
  const { track } = useAnalytics()

  const handlePrimaryAction = (evt) => {
    track("click_primary_call_to_action", {
      action: typeof primaryAction === "string" ? primaryAction : "button",
      title: primaryTitle,
    })
    if (typeof primaryAction === "function") {
      primaryAction(evt)
    }
  }

  const handleSecondaryAction = (evt) => {
    track("click_secondary_call_to_action", {
      action: typeof secondaryAction === "string" ? secondaryAction : "button",
      title: secondaryTitle,
    })
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
        {typeof primaryAction === "string" ? (
          <Button
            color="primary"
            variant="solid"
            href={primaryAction}
            onClick={handlePrimaryAction}
            component={"a"}
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
            onClick={handleSecondaryAction}
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
      </Stack>
    </>
  )
}

export default CallToAction
