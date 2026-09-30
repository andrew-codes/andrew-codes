// Single source of truth for the recommendations shown on the home page and
// /recommendations, and published to agents at /agent/recommendations.json and
// as Review structured data. The Recommendation component
// (app/components/Recommendation.tsx) renders them. Names, titles, employers
// and photos are public; do not add contact details or a relationship field.

import { getCompany, type Company } from "./companies"

type Recommendation = {
  // Stable, kebab-case identifier; used as the React key and the JSON-LD fragment.
  id: string
  author: {
    name: string
    title: string
    company: Company
    // Site-relative path to the author's photo.
    image: string
  }
  featured: boolean
  paragraphs: string[]
}

const company = getCompany

// Display order: featured recommendations first, then the rest.
const recommendations: Recommendation[] = [
  {
    id: "denise-architetto",
    author: {
      name: "Denise Architetto",
      title: "Principal Group Engineering Manager (Director)",
      company: company("microsoft"),
      image: "/images/denise.jpeg",
    },
    featured: true,
    paragraphs: [
      "Andrew is a highly talented and passionate engineer who consistently brings innovation, precision, and thoughtfulness to everything he does. He’s a true trailblazer—always exploring modern technologies to solve complex legacy challenges and driving engineering productivity and efficiency across the board.",
      "Within the team, Andrew is often referred to as “the professor”—a well-earned nickname that speaks to his natural ability to mentor and guide others. He excels at helping early-in-career engineers grow, teaching them solid engineering practices, design patterns, and how to effectively break down complex problems into clear, manageable solutions.",
      "Andrew takes great pride in his work and has been instrumental in designing and implementing core engineering solutions for Microsoft’s Content Management System (CMS). His contributions have been critical to ensuring the reliability and scalability of a platform that handles over 15 billion requests per month.",
      "He combines deep technical expertise with a passion for quality, mentorship, and continuous improvement. I highly recommend Andrew to any organization looking for a principled and forward-thinking engineer who leads with both skill and generosity.",
    ],
  },
  {
    id: "rick-cabrera",
    author: {
      name: "Rick Cabrera",
      title: "Chief Technology Officer (CTO)",
      company: company("experience"),
      image: "/images/rick-cabrera.jpeg",
    },
    featured: true,
    paragraphs: [
      "Andrew is a fantastic software developer. He was hired on at Experience to bring focus and leadership to our front-end technology stack and his impact has been significant. His technical acumen and ability to work extremely well with our design team has brought beautiful and functional components, along with consistency and improved development speed to our team.",
      "His commitment to personal growth and to his team is beyond reproach. Aside from constantly learning new technologies and building hobby projects, Andrew is a thoughtful developer and leader that seeks and is very responsive to feedback from his peers and managers. I’m excited for what the future holds for Andrew and recommend him highly. While he’d be a significant asset to any team looking for immediate technical implementation and leadership, his potential is immense and very much worth consideration for your team.",
    ],
  },
  {
    id: "darnell-brown",
    author: {
      name: "Darnell Brown",
      title: "Principal Engineering Manager",
      company: company("microsoft"),
      image: "/images/darnell.jpeg",
    },
    featured: true,
    paragraphs: [
      "Where do I start. Andrew’s impact has been felt at all levels of our team and he is as gifted and well seasoned of any engineer that I have ever seen and witnessed firsthand. He flourishes in ambiguity. He excels in the unknown. He leads when others are not watching, and he priorities and commands engineering excellence through his intentional actions of continuous improvement with a strong affinity for effectively establishing unique and collaborative mechanisms. His front end ability is unmatched, but more than that, he has continuously elevated the engineers around him to think and breath through a value driven lens of quality. This is what sets Andrew apart. Andrew is the principal, distinguished, staff engineer that could help lead any team to new heights and achievements. Andrew’s selfless and humble approach to growth and improvement is one that I respect so much given his tenure in the industry. He’s a leader that isn’t afraid to take feedback. He simply receives and gives back a continuously improved version of himself. Hire the man!!",
    ],
  },
  {
    id: "keith-gargano",
    author: {
      name: "Keith Gargano",
      title: "Software Development Manager",
      company: company("amazon-studios"),
      image: "/images/keith.jpeg",
    },
    featured: false,
    paragraphs: [
      "Andrew is a talented and passionate engineer whose architectural and testing rigor consistently improves whatever application stack he is engineering. He is collaborative by nature, happy to learn the perspectives of others, and eager to delight the user.",
      "Andrew is visionary in his approach towards software development. When supported by the right team, capable of consuming or building cutting edge frameworks. He is an advocate for developer best practices, keenly aware of the importance of semantically idiomatic code and the long term value of Test Driven Development.",
      "When I think back to working with Andrew, and consider what ‘Archetype’ he filled, he could best be described as the Engineering Professor. Excited about both learning and teaching others, well versed in theory and brimming at the chance to put theory into practice.",
      "If you want to elevate your team by bring in techniques that will enhance your quality, upgrade to the newest and most exciting frameworks, and really raise the bar for an organization looking for an engineer who can mentor and teach, Andrew is your one stop shop.",
    ],
  },
  {
    id: "walker-smith",
    author: {
      name: "Walker Smith",
      title: "Senior Software Engineer",
      company: company("microsoft"),
      image: "/images/walker-smith.jpeg",
    },
    featured: false,
    paragraphs: [
      "Andrew stands out as the best I’ve ever worked with. What sets him apart isn’t just his undeniable technical brilliance, it’s his rare ability to consistently build the right thing at exactly the right time. He does this while applying best practices with a level of precision and ease that can only come from years of deliberate skill-building. The result is work that is not only high quality and reliable but deeply thoughtful and impactful.",
      "Beyond his technical excellence, Andrew is an organic leader in the truest sense. He doesn’t seek the spotlight, yet people naturally look to him for direction. His approach is grounded in servant leadership. He lifts others up, leads by example, and creates space for collaboration and growth. His mentorship is unmatched. Whether you’re just getting started or deep into your career, Andrew meets you where you are and helps you move the needle forward in ways that feel both challenging and empowering.",
      "He is relentlessly curious and deeply committed to growth. He embodies a true growth mindset—never static, always evolving. Andrew is constantly expanding his technical skillset, not just to keep pace, but to stay at the cutting edge of what’s possible. He seeks out emerging technologies, tools, and practices with the same rigor he applies to mastering them. Whether it’s diving into new domains or developing his leadership capacity, Andrew pushes boundaries—not only for himself, but for everyone around him.",
      "Working with Andrew doesn’t just elevate the product—it elevates the people. His presence raises the bar for what great truly looks like.",
    ],
  },
  {
    id: "jamel-jenkins",
    author: {
      name: "Jamel Jenkins",
      title: "Principal Engineering Manager",
      company: company("microsoft"),
      image: "/images/jamel.jpeg",
    },
    featured: false,
    paragraphs: [
      "I had the pleasure of working with Andrew Smith on the F1Next initiative to revamp the M365 In-App Help experience. Andrew brought deep expertise in frontend development and architecture, helping to elevate the quality, performance, and scalability of the platform. His work was instrumental in setting best practices across the engineering team.",
      "We also collaborated on an internal drag-and-drop editor project — a foundation that evolved into a broader internal component library. Andrew’s attention to detail and thoughtful approach to reusable design made a lasting impact.",
      "Andrew operates at an architect level. If you’re looking to raise the bar on your team’s frontend codebase, he’s absolutely the person to bring in. His technical vision, strong coding standards, and mentorship mindset make him an invaluable asset.",
      "Beyond the tech, Andrew is kind, collaborative, and a joy to work with. He’s also built an impressive home automation tool on the side, which shows his passion for building smart, user-focused systems. Any team would be lucky to have him.",
    ],
  },
  {
    id: "micah-prescott",
    author: {
      name: "Micah Prescott",
      title: "Software Engineer 3",
      company: company("calendly"),
      image: "/images/micah.jpeg",
    },
    featured: false,
    paragraphs: [
      "Andrew is motivated and proactive individual in web development. He is passionate about his work and enjoys finding opportunities to learn and challenge himself. He is detail-oriented and he has the mental stamina to wrap his head around complex problems. Andrew brings a positive perspective to the workplace and he has a great attitude when faced with challenges.",
      "He is an absolute pleasure to work with and he loves what he does for a living. Andrew inspires me.",
    ],
  },
  {
    id: "arun-arivarasan",
    author: {
      name: "Arun Arivarasan",
      title: "Senior Software Engineer",
      company: company("microsoft"),
      image: "/images/arun.jpeg",
    },
    featured: false,
    paragraphs: [
      "I’ve had the pleasure of working with Andrew, and I must say he is an exceptionally talented individual when it comes to technology. His expertise spans across all areas—from problem-solving and guiding peers to consistently delivering high-quality work. His passion for technology is truly unmatched and incredibly inspiring.",
      "Andrew is the kind of colleague everyone wants on their team. He is not only technically sound but also genuinely committed to helping others grow. His drive for innovation and excellence is evident in everything he does.",
      "I had the chance to work with him on building the WYSIWYG editor for our content platform, implemented JSON editor and a unified editor that supports multiple formats for authoring content. His contributions significantly improved the flexibility and usability of the platform.",
      "Andrew is a complete full-stack architect. His precision in engineering and eagerness to deliver the best are always impressive. He’s our go-to person whenever we face technical challenges. His depth of knowledge, calm problem-solving approach, and willingness to help make him an invaluable team member.",
      "He is a great leader, mentor, and guide who supports his peers and helps them grow. It’s rare to find someone who combines such deep technical skill with humility and a collaborative spirit.",
      "I highly recommend Andrew for any opportunity that values technical excellence, strong leadership, and a passion for innovation.",
    ],
  },
  {
    id: "maxine-quan",
    author: {
      name: "Maxine Quan",
      title: "Software Engineer 2",
      company: company("microsoft"),
      image: "/images/maxine.jpeg",
    },
    featured: false,
    paragraphs: [
      "I had the pleasure of working with Andrew and was especially grateful for his support. He jumped in without hesitation, sharing his deep knowledge and practical insights that made a huge difference in getting things unblocked.",
      "Andrew is not only technically sharp but also incredibly collaborative and generous with his time - someone who genuinely makes the team better. I’ve learned a lot from him and truly appreciate his steady presence during crunch time.",
    ],
  },
  {
    id: "russell-thatcher",
    author: {
      name: "Russell Thatcher",
      title: "Software Engineering Leader",
      company: company("matrix-resources"),
      image: "/images/russell.jpeg",
    },
    featured: false,
    paragraphs: [
      "Andrew is one of my best team members. He possesses a deep passion for software and technology, and his knack for creative software solutions has positioned him as a trusted advisor for many clients. Furthermore, Andrew exhibits a degree of expertise and professionalism that has impressed every client that he has worked with to date. These factors combined with Andrew’s tremendous work ethic produce, in my opinion, a top tier consultant.",
    ],
  },
]

const featuredRecommendations = recommendations.filter((recommendation) => recommendation.featured)
const otherRecommendations = recommendations.filter((recommendation) => !recommendation.featured)

export { featuredRecommendations, otherRecommendations, recommendations }
export type { Recommendation }
