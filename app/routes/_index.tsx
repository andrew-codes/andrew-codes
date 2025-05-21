import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  MetaFunction,
  Link as RemixLink,
  useLoaderData,
} from "@remix-run/react"
import { fileURLToPath } from "url"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import PostCard from "../components/PostCard"
import Recommendation from "../components/Recommendation"
import { getFilePartsToHash, getHash } from "../libs/hash.server"
import { getMdxPages } from "../libs/mdx.server"
import { getServerTimeHeader } from "../libs/timing.server"
import { useLoaderHeaders } from "../libs/utils"
import darnell from "../public/images/darnell.jpeg"
import denise from "../public/images/denise.jpeg"
import rick from "../public/images/rick-cabrera.jpeg"

const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const timings = {}
  const posts = await getMdxPages({ request, timings })

  const __filename = fileURLToPath(import.meta.url)
  const selfFilePartsToHash = await getFilePartsToHash(__filename)

  return json(
    { posts: posts },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=3600",
        Vary: "Cookie",
        "Server-Timing": getServerTimeHeader(timings),
        ETag: getHash(
          posts
            .flatMap((post) => [post.code, JSON.stringify(post.frontmatter)])
            .concat([selfFilePartsToHash]),
        ),
      },
    },
  )
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const headers: HeadersFunction = useLoaderHeaders()

const meta: MetaFunction = () => {
  return [
    {
      title: "Andrew Smith | Home",
    },
    {
      name: "description",
      content:
        "Professional profile of Andrew Smith. View my resume, recommendations, and featured posts.",
    },
    {
      name: "og:title",
      content: "Andrew Smith - Staff Software Engineer",
    },
    {
      name: "og:description",
      content:
        "Professional profile of Andrew Smith. View my resume, recommendations, and featured posts.",
    },
  ]
}

const HomeRoute = () => {
  const { posts } = useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>
        <CallToAction />
        <Typography level="body-sm" sx={{ marginTop: 2 }}>
          View my full experience and leadership impact in one place.
        </Typography>
      </PageHeader>
      <Box component="section">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
            marginBottom: 2,
          }}
        >
          <Typography level="h2" fontSize="xl2" fontWeight={700}>
            Recommendations
          </Typography>
          <Button variant="plain" component={RemixLink} to="/recommendations">
            View All
          </Button>
        </Box>
        <Stack direction="column" spacing={2}>
          <Recommendation
            summarized
            profileImage={denise}
            name="Denise Architetto"
            title="
Principal Group Engineering Manager (Director) at Microsoft"
          >
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Andrew is a highly talented and passionate engineer who
              consistently brings innovation, precision, and thoughtfulness to
              everything he does. He's a true trailblazer—always exploring
              modern technologies to solve complex legacy challenges and driving
              engineering productivity and efficiency across the board. Within
              the team,
            </Typography>{" "}
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Andrew is often referred to as “the professor”—a well-earned
              nickname that speaks to his natural ability to mentor and guide
              others. He excels at helping early-in-career engineers grow,
              teaching them solid engineering practices, design patterns, and
              how to effectively break down complex problems into clear,
              manageable solutions.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Andrew takes great pride in his work and has been instrumental in
              designing and implementing core engineering solutions for
              Microsoft's Content Management System (CMS). His contributions
              have been critical to ensuring the reliability and scalability of
              a platform that handles over 15 billion requests per month.{" "}
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              He combines deep technical expertise with a passion for quality,
              mentorship, and continuous improvement. I highly recommend Andrew
              to any organization looking for a principled and forward-thinking
              engineer who leads with both skill and generosity.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              He combines deep technical expertise with a passion for quality,
              mentorship, and continuous improvement. I highly recommend Andrew
              to any organization looking for a principled and forward-thinking
              engineer who leads with both skill and generosity.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              He combines deep technical expertise with a passion for quality,
              mentorship, and continuous improvement. I highly recommend Andrew
              to any organization looking for a principled and forward-thinking
              engineer who leads with both skill and generosity.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              He combines deep technical expertise with a passion for quality,
              mentorship, and continuous improvement. I highly recommend Andrew
              to any organization looking for a principled and forward-thinking
              engineer who leads with both skill and generosity.
            </Typography>
          </Recommendation>
          <Recommendation
            summarized
            profileImage={rick}
            name="Rick Cabrera"
            title="CTO at Experience"
          >
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Andrew is a fantastic software developer. He was hired on at
              Experience to bring focus and leadership to our front-end
              technology stack and his impact has been significant. His
              technical acumen and ability to work extremely well with our
              design team has brought beautiful and functional components, along
              with consistency and improved development speed to our team.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              His commitment to personal growth and to his team is beyond
              reproach. Aside from constantly learning new technologies and
              building hobby projects, Andrew is a thoughtful developer and
              leader that seeks and is very responsive to feedback from his
              peers and managers. I'm excited for what the future holds for
              Andrew and recommend him highly. While he'd be a significant asset
              to any team looking for immediate technical implementation and
              leadership, his potential is immense and very much worth
              consideration for your team.
            </Typography>
          </Recommendation>
          <Recommendation
            summarized
            profileImage={darnell}
            name="Darnell Brown"
            title="Principal Software Engineer at Microsoft"
          >
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Where do I start. Andrew's impact has been felt at all levels of
              our team and he is as gifted and well seasoned of any engineer
              that I have ever seen and witnessed firsthand. He flourishes in
              ambiguity. He excels in the unknown. He leads when others are not
              watching, and he priorities and commands engineering excellence
              through his intentional actions of continuous improvement with a
              strong affinity for effectively establishing unique and
              collaborative mechanisms. His front end ability is unmatched, but
              more than that, he has continuously elevated the engineers around
              him to think and breath through a value driven lens of quality.
              This is what sets Andrew apart. Andrew is the principal,
              distinguished, staff engineer that could help lead any team to new
              heights and achievements. Andrew's selfless and humble approach to
              growth and improvement is one that I respect so much given his
              tenure in the industry. He's a leader that isn't afraid to take
              feedback. He simply receives and gives back a continuously
              improved version of himself. Hire the man!!
            </Typography>
          </Recommendation>
        </Stack>
      </Box>
      <Box component="section">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
            marginBottom: 2,
          }}
        >
          <Typography level="h2" fontSize="xl2" fontWeight={700}>
            Featured Posts
          </Typography>
          <Button variant="plain" component={RemixLink} to="/posts">
            View All
          </Button>
        </Box>
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-between"
        >
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </Stack>
      </Box>
    </>
  )
}

export default HomeRoute
export { headers, loader, meta }
