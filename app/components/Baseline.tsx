import CssBaseline from "@mui/joy/CssBaseline"
import GlobalStyles from "@mui/joy/GlobalStyles"
import { useTheme } from "@mui/joy/styles"

const Baseline = ({ children }) => {
  const theme = useTheme()
  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "*": {
            textSizeAdjust: "100%",
          },
          "@media print": {
            backgroundColor: "#fff",
          },
          body: {
            margin: "0 auto",
          },
          html: {
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.palette.text.tertiary} transparent`,
            "&::-webkit-scrollbar": {
              width: theme.spacing(0.5),
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.text.tertiary,
              borderRadius: "3px",
            },
            "&::--webkit-scrollbar-track": {
              background: "transparent",
            },
          },
        }}
      />
      {children}
    </>
  )
}

export default Baseline
