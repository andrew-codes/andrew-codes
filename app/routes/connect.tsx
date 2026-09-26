import Box from "@mui/joy/Box"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import QRCode from "qrcode"
import type { FC } from "react"
import type { LoaderFunctionArgs, MetaFunction } from "react-router"
import { useLoaderData } from "react-router"

// LinkedIn's own QR-connect feature (and its public API) only opens the
// scanned profile page for the visitor to tap Connect themselves - there is
// no documented deep link or unauthenticated API that sends the invitation
// directly, so this falls back to encoding the plain profile URL.
const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/jamesandrewsmith"

const loader = async (_args: LoaderFunctionArgs) => {
  const qrCodeSvg = await QRCode.toString(LINKEDIN_PROFILE_URL, {
    type: "svg",
    margin: 1,
  })

  return { qrCodeSvg }
}

const HEADSHOT_SRC = "/images/andrew-smith.webp"

const meta: MetaFunction = () => {
  return [
    {
      title: "Andrew Smith | Connect",
    },
    {
      name: "description",
      content: "Scan this QR code to connect with Andrew Smith on LinkedIn.",
    },
  ]
}

const ConnectPageContent: FC<{ qrCodeSvg: string }> = ({ qrCodeSvg }) => (
  <Box
    sx={{
      position: "relative",
      minHeight: "100dvh",
      textAlign: "center",
    }}
  >
    <Stack
      direction="column"
      spacing={1}
      alignItems="center"
      sx={{
        position: "absolute",
        top: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "20rem",
      }}
    >
      <Box
        component="img"
        src={HEADSHOT_SRC}
        alt="Andrew Smith"
        sx={{
          width: "5rem",
          height: "5rem",
          borderRadius: "50%",
          objectFit: "cover",
          mb: 1,
        }}
      />
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
      <Typography level="body-lg">Principal Software Engineer</Typography>
      <Typography level="body-lg">@ Atlassian</Typography>
    </Stack>
    <Box
      role="img"
      aria-label="QR code linking to Andrew Smith's LinkedIn profile"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "20rem",
        "& svg": {
          width: "100%",
          height: "auto",
        },
      }}
      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
    />
  </Box>
)

const ConnectRoute = () => {
  const { qrCodeSvg } = useLoaderData<typeof loader>()

  return <ConnectPageContent qrCodeSvg={qrCodeSvg} />
}

export default ConnectRoute
export { ConnectPageContent, LINKEDIN_PROFILE_URL, loader, meta }
