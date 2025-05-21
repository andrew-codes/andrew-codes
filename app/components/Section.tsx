import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import { FC, PropsWithChildren } from "react"

const SectionHeader: FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{}}>
      <Typography level="h2" fontSize="xl2" fontWeight={700} sx={{}}>
        {title}
      </Typography>
      {children}
    </Stack>
  )
}

const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack component="section" spacing={0.5} direction="column">
      {children}
    </Stack>
  )
}

export { Section, SectionHeader }
