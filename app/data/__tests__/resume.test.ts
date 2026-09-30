import { describe, expect, it } from "vitest"
import { resume, skillTopics } from "../resume"
import { topics } from "../topics"

describe("resume", () => {
  it("lists experience newest first with YYYY-MM dates and city-level locations", () => {
    const starts = resume.experience.map((job) => job.start)

    expect(starts).toEqual([...starts].sort().reverse())
    for (const job of resume.experience) {
      expect(job.start).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/)
      expect(job.end).toMatch(/^(\d{4}-(0[1-9]|1[0-2])|present)$/)
      if (job.location) expect(job.location).toMatch(/^[A-Za-z .]+, [A-Z]{2}$/)
    }
  })

  it("has exactly one current role and unique company slugs", () => {
    const slugs = resume.experience.map((job) => job.company.slug)

    expect(resume.experience.filter((job) => job.end === "present")).toHaveLength(1)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it("maps only listed skills onto known topics", () => {
    const skills = new Set(resume.skills.flatMap((group) => group.items))
    const topicSlugs = new Set<string>(topics.map((topic) => topic.slug))

    for (const [skill, topic] of Object.entries(skillTopics)) {
      expect(skills.has(skill), skill).toBe(true)
      expect(topicSlugs.has(topic), topic).toBe(true)
    }
  })
})
