import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import type { HeadersFunction } from "@remix-run/node"
import { MetaFunction, useLocation } from "@remix-run/react"
import CallToAction from "../components/CallToAction"
import PageHeader from "../components/PageHeader"
import Recommendation from "../components/Recommendation"
import { Section, SectionHeader } from "../components/Section"
import { useLoaderHeaders } from "../libs/utils"
import darnell from "../public/images/darnell.jpeg"
import denise from "../public/images/denise.jpeg"
import keith from "../public/images/keith.jpeg"
import rick from "../public/images/rick-cabrera.jpeg"
import walkerSmith from "../public/images/walker-smith.jpeg"

const headers: HeadersFunction = useLoaderHeaders()

const meta: MetaFunction = () => {
  return [
    {
      title: "Andrew Smith | Home",
    },
    {
      name: "description",
      content:
        "Recommendations from my peers, managers, and leaders in the industry.",
    },
    {
      name: "og:title",
      content: "Andrew Smith - Staff Software Engineer",
    },
    {
      name: "og:description",
      content:
        "Recommendations from my peers, managers, and leaders in the industry.",
    },
  ]
}

const RecommendationsRoute = () => {
  const location = useLocation()
  const prioritizeFeatured =
    new URLSearchParams(location.search).get("priority") === "featured"

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
          Here's what my peers, managers, and leaders have to say about me.
        </Typography>
        <CallToAction secondaryTitle="Read Posts" secondaryAction="/posts" />
      </PageHeader>
      <Section>
        <SectionHeader title="Recommendations" />
        <Stack direction="column" spacing={2}>
          {prioritizeFeatured && (
            <>
              <Recommendation
                summarized
                profileImage={denise}
                name="Denise Architetto"
                company="Microsoft"
                title="
Principal Group Engineering Manager (Director)"
              >
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Andrew is a highly talented and passionate engineer who
                  consistently brings innovation, precision, and thoughtfulness
                  to everything he does. He's a true trailblazer—always
                  exploring modern technologies to solve complex legacy
                  challenges and driving engineering productivity and efficiency
                  across the board.
                </Typography>
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Within the team, Andrew is often referred to as “the
                  professor”—a well-earned nickname that speaks to his natural
                  ability to mentor and guide others. He excels at helping
                  early-in-career engineers grow, teaching them solid
                  engineering practices, design patterns, and how to effectively
                  break down complex problems into clear, manageable solutions.
                </Typography>
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Andrew takes great pride in his work and has been instrumental
                  in designing and implementing core engineering solutions for
                  Microsoft's Content Management System (CMS). His contributions
                  have been critical to ensuring the reliability and scalability
                  of a platform that handles over 15 billion requests per month.{" "}
                </Typography>
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  He combines deep technical expertise with a passion for
                  quality, mentorship, and continuous improvement. I highly
                  recommend Andrew to any organization looking for a principled
                  and forward-thinking engineer who leads with both skill and
                  generosity.
                </Typography>
              </Recommendation>
              <Recommendation
                summarized
                company="Experience LLC."
                profileImage={rick}
                name="Rick Cabrera"
                title="Chief Technology Officer (CTO)"
              >
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Andrew is a fantastic software developer. He was hired on at
                  Experience to bring focus and leadership to our front-end
                  technology stack and his impact has been significant. His
                  technical acumen and ability to work extremely well with our
                  design team has brought beautiful and functional components,
                  along with consistency and improved development speed to our
                  team.
                </Typography>
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  His commitment to personal growth and to his team is beyond
                  reproach. Aside from constantly learning new technologies and
                  building hobby projects, Andrew is a thoughtful developer and
                  leader that seeks and is very responsive to feedback from his
                  peers and managers. I'm excited for what the future holds for
                  Andrew and recommend him highly. While he'd be a significant
                  asset to any team looking for immediate technical
                  implementation and leadership, his potential is immense and
                  very much worth consideration for your team.
                </Typography>
              </Recommendation>
              <Recommendation
                summarized
                profileImage={darnell}
                company="Microsoft"
                name="Darnell Brown"
                title="Principal Software Engineer"
              >
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Where do I start. Andrew's impact has been felt at all levels
                  of our team and he is as gifted and well seasoned of any
                  engineer that I have ever seen and witnessed firsthand. He
                  flourishes in ambiguity. He excels in the unknown. He leads
                  when others are not watching, and he priorities and commands
                  engineering excellence through his intentional actions of
                  continuous improvement with a strong affinity for effectively
                  establishing unique and collaborative mechanisms. His front
                  end ability is unmatched, but more than that, he has
                  continuously elevated the engineers around him to think and
                  breath through a value driven lens of quality. This is what
                  sets Andrew apart. Andrew is the principal, distinguished,
                  staff engineer that could help lead any team to new heights
                  and achievements. Andrew's selfless and humble approach to
                  growth and improvement is one that I respect so much given his
                  tenure in the industry. He's a leader that isn't afraid to
                  take feedback. He simply receives and gives back a
                  continuously improved version of himself. Hire the man!!
                </Typography>
              </Recommendation>
            </>
          )}
          <Recommendation
            summarized
            profileImage={keith}
            name="Keith Gargano"
            company="Amazon Studios"
            title="Software Development Manager"
          >
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Andrew is a talented and passionate engineer whose architectural
              and testing rigor consistently improves whatever application stack
              he is engineering. He is collaborative by nature, happy to learn
              the perspectives of others, and eager to delight the user.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Andrew is visionary in his approach towards software development.
              When supported by the right team, capable of consuming or building
              cutting edge frameworks. He is an advocate for developer best
              practices, keenly aware of the importance of semantically
              idiomatic code and the long term value of Test Driven Development.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              When I think back to working with Andrew, and consider what
              'Archetype' he filled, he could best be described as the
              Engineering Professor. Excited about both learning and teaching
              others, well versed in theory and brimming at the chance to put
              theory into practice.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              If you want to elevate your team by bring in techniques that will
              enhance your quality, upgrade to the newest and most exciting
              frameworks, and really raise the bar for an organization looking
              for an engineer who can mentor and teach, Andrew is your one stop
              shop.
            </Typography>
          </Recommendation>
          <Recommendation
            summarized
            profileImage={walkerSmith}
            name="Walker Smith"
            company="Microsoft"
            title="Senior Software Engineer"
          >
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Andrew stands out as the best I've ever worked with. What sets him
              apart isn't just his undeniable technical brilliance, it's his
              rare ability to consistently build the right thing at exactly the
              right time. He does this while applying best practices with a
              level of precision and ease that can only come from years of
              deliberate skill-building. The result is work that is not only
              high quality and reliable but deeply thoughtful and impactful.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Beyond his technical excellence, Andrew is an organic leader in
              the truest sense. He doesn't seek the spotlight, yet people
              naturally look to him for direction. His approach is grounded in
              servant leadership. He lifts others up, leads by example, and
              creates space for collaboration and growth. His mentorship is
              unmatched. Whether you're just getting started or deep into your
              career, Andrew meets you where you are and helps you move the
              needle forward in ways that feel both challenging and empowering.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              He is relentlessly curious and deeply committed to growth. He
              embodies a true growth mindset—never static, always evolving.
              Andrew is constantly expanding his technical skillset, not just to
              keep pace, but to stay at the cutting edge of what's possible. He
              seeks out emerging technologies, tools, and practices with the
              same rigor he applies to mastering them. Whether it's diving into
              new domains or developing his leadership capacity, Andrew pushes
              boundaries—not only for himself, but for everyone around him.
            </Typography>
            <Typography level="body-md" sx={{ marginBottom: 2 }}>
              Working with Andrew doesn't just elevate the product—it elevates
              the people. His presence raises the bar for what great truly looks
              like.
            </Typography>
          </Recommendation>
          {!prioritizeFeatured && (
            <>
              <Recommendation
                summarized
                profileImage={denise}
                name="Denise Architetto"
                company="Microsoft"
                title="
Principal Group Engineering Manager (Director)"
              >
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Andrew is a highly talented and passionate engineer who
                  consistently brings innovation, precision, and thoughtfulness
                  to everything he does. He's a true trailblazer—always
                  exploring modern technologies to solve complex legacy
                  challenges and driving engineering productivity and efficiency
                  across the board.
                </Typography>
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Within the team, Andrew is often referred to as “the
                  professor”—a well-earned nickname that speaks to his natural
                  ability to mentor and guide others. He excels at helping
                  early-in-career engineers grow, teaching them solid
                  engineering practices, design patterns, and how to effectively
                  break down complex problems into clear, manageable solutions.
                </Typography>
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Andrew takes great pride in his work and has been instrumental
                  in designing and implementing core engineering solutions for
                  Microsoft's Content Management System (CMS). His contributions
                  have been critical to ensuring the reliability and scalability
                  of a platform that handles over 15 billion requests per month.{" "}
                </Typography>
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  He combines deep technical expertise with a passion for
                  quality, mentorship, and continuous improvement. I highly
                  recommend Andrew to any organization looking for a principled
                  and forward-thinking engineer who leads with both skill and
                  generosity.
                </Typography>
              </Recommendation>
              <Recommendation
                summarized
                company="Experience LLC."
                profileImage={rick}
                name="Rick Cabrera"
                title="Chief Technology Officer (CTO)"
              >
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Andrew is a fantastic software developer. He was hired on at
                  Experience to bring focus and leadership to our front-end
                  technology stack and his impact has been significant. His
                  technical acumen and ability to work extremely well with our
                  design team has brought beautiful and functional components,
                  along with consistency and improved development speed to our
                  team.
                </Typography>
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  His commitment to personal growth and to his team is beyond
                  reproach. Aside from constantly learning new technologies and
                  building hobby projects, Andrew is a thoughtful developer and
                  leader that seeks and is very responsive to feedback from his
                  peers and managers. I'm excited for what the future holds for
                  Andrew and recommend him highly. While he'd be a significant
                  asset to any team looking for immediate technical
                  implementation and leadership, his potential is immense and
                  very much worth consideration for your team.
                </Typography>
              </Recommendation>
              <Recommendation
                summarized
                profileImage={darnell}
                company="Microsoft"
                name="Darnell Brown"
                title="Principal Software Engineer"
              >
                <Typography level="body-md" sx={{ marginBottom: 2 }}>
                  Where do I start. Andrew's impact has been felt at all levels
                  of our team and he is as gifted and well seasoned of any
                  engineer that I have ever seen and witnessed firsthand. He
                  flourishes in ambiguity. He excels in the unknown. He leads
                  when others are not watching, and he priorities and commands
                  engineering excellence through his intentional actions of
                  continuous improvement with a strong affinity for effectively
                  establishing unique and collaborative mechanisms. His front
                  end ability is unmatched, but more than that, he has
                  continuously elevated the engineers around him to think and
                  breath through a value driven lens of quality. This is what
                  sets Andrew apart. Andrew is the principal, distinguished,
                  staff engineer that could help lead any team to new heights
                  and achievements. Andrew's selfless and humble approach to
                  growth and improvement is one that I respect so much given his
                  tenure in the industry. He's a leader that isn't afraid to
                  take feedback. He simply receives and gives back a
                  continuously improved version of himself. Hire the man!!
                </Typography>
              </Recommendation>
            </>
          )}
        </Stack>
      </Section>
    </Stack>
  )
}

export default RecommendationsRoute
export { headers, meta }
