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
          "@media print": {
            background: "#fff",
            "@page": {
              size: "8.5in 11in",
              margin: "0.25in",
            },
          },
          "*": {
            textSizeAdjust: "100%",
          },
          body: {
            margin: "0 auto",
            minWidth: "390px",
            "@media print": {
              backgroundColor: "transparent !important",
              padding: "0 !important",
            },
          },
          html: {
            "@media print": {
              backgroundColor: "transparent !important",
              padding: "0 !important",
            },
            minWidth: "390px",
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
