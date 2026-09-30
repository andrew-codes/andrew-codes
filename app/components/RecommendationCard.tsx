import Typography from "@mui/joy/Typography"
import type { FC } from "react"
import type { Recommendation as RecommendationData } from "../data/recommendations"
import Recommendation from "./Recommendation"

// Renders one recommendation from app/data/recommendations.ts. The `id` is the
// anchor that /agent/recommendations.json and the Review structured data link to.
const RecommendationCard: FC<{ recommendation: RecommendationData }> = ({ recommendation: { id, author, paragraphs } }) => (
  <Recommendation id={id} summarized profileImage={author.image} name={author.name} title={author.title} company={author.company.name}>
    {paragraphs.map((paragraph, index) => (
      <Typography key={index} level="body-md" sx={{ marginBottom: 2 }}>
        {paragraph}
      </Typography>
    ))}
  </Recommendation>
)

export default RecommendationCard
