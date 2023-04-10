import type { FC } from "react"
import { Helmet } from "react-helmet"
import favicon from "./../images/favicon-48.png"
import favicon1024 from "./../images/favicon-1024.png"

type PageMetaProps = {
  title: string
  description: string
  jobTitle?: string
  url?: string
  lang?: string
}
const PageMeta: FC<PageMetaProps> = ({
  title,
  description,
  jobTitle = "Senior Software Engineer",
  url = "https://andrew.codes",
  lang = "en",
}) => {
  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={jobTitle} />
      <meta name="og:description" content={description} />
      <meta name="og:type" content="website" />
      <link rel="canonical" href={url} />
      <link rel="shortcut icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon1024} />
    </Helmet>
  )
}

export default PageMeta
