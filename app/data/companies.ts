// Company slug registry: the join key between the data modules and post
// front matter. Recommendations reference an employer by `slug`; the resume
// data and post front matter `companies` will use the same slugs.
//
// Calendly and Amazon Studios do not appear in the resume; they are here as
// organisations that recommended Andrew. `name` is the display name shown on
// the site (for example the recommendation chip).

type Company = {
  slug: string
  name: string
}

const companies = [
  { slug: "microsoft", name: "Microsoft" },
  { slug: "experience", name: "Experience LLC." },
  { slug: "matrix-professional-services", name: "Matrix Resources" },
  { slug: "amazon-studios", name: "Amazon Studios" },
  { slug: "calendly", name: "Calendly" },
] as const satisfies readonly Company[]

type CompanySlug = (typeof companies)[number]["slug"]

const getCompany = (slug: CompanySlug): Company => {
  const company = companies.find((c) => c.slug === slug)
  if (!company) throw new Error(`Unknown company: ${slug}`)
  return { slug: company.slug, name: company.name }
}

export { companies, getCompany }
export type { Company, CompanySlug }
