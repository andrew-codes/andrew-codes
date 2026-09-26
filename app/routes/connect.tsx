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

const meta: MetaFunction = () => {
  return [
    {
      title: "James Andrew Smith | Connect",
    },
    {
      name: "description",
      content:
        "Scan this QR code to connect with James Andrew Smith on LinkedIn.",
    },
  ]
}

const ConnectPageContent: FC<{ qrCodeSvg: string }> = ({ qrCodeSvg }) => (
  <Stack
    direction="column"
    spacing={4}
    alignItems="center"
    justifyContent="center"
    sx={{
      textAlign: "center",
      minHeight: "100dvh",
      px: 2,
      py: 4,
    }}
  >
    <Typography level="h1" fontWeight={900} sx={{ fontSize: "2rem" }}>
      James Andrew Smith
    </Typography>
    <Box
      sx={{
        width: "100%",
        maxWidth: "20rem",
        "& svg": {
          width: "100%",
          height: "auto",
        },
      }}
      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
    />
  </Stack>
)

const ConnectRoute = () => {
  const { qrCodeSvg } = useLoaderData<typeof loader>()

  return <ConnectPageContent qrCodeSvg={qrCodeSvg} />
}

export default ConnectRoute
export { ConnectPageContent, LINKEDIN_PROFILE_URL, loader, meta }
