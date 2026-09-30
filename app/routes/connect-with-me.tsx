import Button from "@mui/joy/Button"
import Card from "@mui/joy/Card"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { MetaFunction } from "react-router"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import { Section, SectionHeader } from "../components/Section"
import { socialLinks } from "../profile"

const description = "Connect with Andrew Smith on LinkedIn or follow along on GitHub."

const meta: MetaFunction = () => {
  return [
    {
      title: "Andrew Smith | Connect with Me",
    },
    {
      name: "description",
      content: description,
    },
    {
      name: "og:title",
      content: "Andrew Smith - Connect with Me",
    },
    {
      name: "og:description",
      content: description,
    },
  ]
}

const ConnectWithMeRoute = () => {
  return (
    <Stack direction="column" spacing={4}>
      <PageHeader>
        <Typography
          level="body-md"
          sx={(theme) => ({
            [theme.breakpoints.up("sm")]: {
              fontSize: "1.5rem",
            },
          })}
        >
          I like meeting people who care about building software well. Say hello, or follow along.
        </Typography>
        <CallToAction variant="connect" secondaryTitle="Read my Posts" secondaryAction="/posts" />
      </PageHeader>
      <Section>
        <SectionHeader title="Connect with Me" />
        <Stack component="ul" direction="column" spacing={2} sx={{ listStyle: "none", m: 0, p: 0 }}>
          {socialLinks.map((link) => (
            <Card
              key={link.id}
              component="li"
              variant="outlined"
              orientation="horizontal"
              sx={(theme) => ({
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "column",
                  alignItems: "stretch",
                },
              })}
            >
              <Stack direction="column" spacing={0.5}>
                <Typography level="h3">{link.label}</Typography>
                <Typography level="body-sm">{link.handle}</Typography>
                <Typography level="body-md">{link.description}</Typography>
              </Stack>
              <Button
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                variant="solid"
                color="primary"
                sx={(theme) => ({ [theme.breakpoints.up("sm")]: { minWidth: "13rem" } })}
                aria-label={`${link.action} (opens in a new tab)`}
              >
                {link.action}
              </Button>
            </Card>
          ))}
        </Stack>
      </Section>
    </Stack>
  )
}

export default ConnectWithMeRoute
export { meta }
