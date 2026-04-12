Blog article content for [andrew-codes.com](https://andrew-codes.com). Each article is written in MDX with YAML front matter.

# Front Matter

All articles require these fields:

```yaml
---
title: Article Title
description: >-
  One or two sentence summary shown in post listings and SEO.
date: YYYY-MM-DD
category: engineering
tags:
  - tag-one
  - tag-two
---
```

**`category`** — must be one of: `engineering`, `agility`, `home automation`

**`tags`** — free-form slugs. Add `featured` to surface the article in the featured section of the site.

# File Layout

**Simple article** (no images or attachments):

```
app/posts/{year}/{slug}.mdx
```

**Article with assets** (images, downloads, code files):

```
app/posts/{year}/{slug}/
  {slug}.mdx
  public/files/    ← images and other assets
```

Reference assets with relative paths from the `.mdx` file:

```md
![Alt text](./public/files/image.png)
```

# Voice and Tone

These articles are written by a working practitioner sharing hard-won, opinionated perspective — not a textbook author, marketing writer, or documentation author. When writing in this voice:

**Be direct and confident.** State the position, then support it. Do not open with hedges or extensive throat-clearing. "I'll tell you why I decided to switch, and here's why you should too" is the right energy.

**Be honest about trade-offs and limitations.** Acknowledge real drawbacks rather than glossing over them. "There was one noticeable drawback: it is a little slow to run your tests" is the right move. Pretending something is perfect when it isn't undermines trust.

**Write from experience, not abstraction.** Ground claims in personal observation. "In my experience, timelines or scope are often adjusted to meet deadlines" is better than "research shows that estimates are often inaccurate." When citing data, acknowledge its limits; when speaking from experience, name it as such.

**Challenge conventional wisdom when the evidence warrants it.** Do not repeat the received wisdom if direct experience contradicts it. Make the counter-argument clearly and explain why.

**Be enthusiastic but not hyperbolic.** "I am quite impressed with Jest" and "this has been a rewarding project" are genuine. Avoid superlatives like "revolutionary" or "game-changing."

**Use the honest answer.** When there is a pragmatic or personal motivation alongside the principled one, name it. "There is also the honest answer: this is a hobby I enjoy" is more trustworthy than pretending every decision is purely technical.

# Structure and Format

**Standard article shape** — use `##` for all top-level sections; the `title` front matter serves as the H1:

1. Optional one- or two-sentence lead before the first `##` (or open with `## Overview`)
2. Problem or motivation section
3. Solution or analysis in logical H2/H3 sections
4. `## Final Thoughts` or `## Conclusion` to close — use this to tie things together and point to related work, not to recap what was just said

**Section headers as questions.** When a section answers an obvious question, make that question the header: `## Why Do We Estimate?`, `## Why Build My Own?`. This helps the reader understand the purpose of the section before reading it.

**Blockquotes for distilled takeaways.** Use `>` to pull out the single most important sentence in a section — the thing a skimming reader should not miss. Place the blockquote after the prose that earns it, not before. One per section at most.

**Tables for comparisons and structured data.** Side-by-side comparisons, tool lists, scenario tables, and step-by-step contrasts all belong in tables rather than verbose prose.

**Numbered lists for sequential steps; bullet lists for parallel items.** Do not use numbered lists for things that can happen in any order.

**Cross-link related articles.** When an article depends on context from another, link to it early. When an article will be followed up, name that explicitly and link when it exists.

# Paragraph and Sentence Style

**Short to medium paragraphs.** One main idea per paragraph. If a paragraph is running long, it is probably two ideas.

**Plain English over jargon.** Use technical terms when they are the right tool, but define them when they first appear: "A Monte Carlo simulation is a technique used to understand the impact of risk and uncertainty in forecasting models."

**Analogies for abstract concepts.** When explaining something abstract, ground it in a concrete analogy. The skyscraper-without-doors analogy for software that does not meet user needs is the right kind of move.

**Acknowledge the obvious objection, then address it.** "The obvious question is: why not just use Alexa or Google Home?" followed by a direct answer is better than pretending the objection does not exist.

**Do not summarize what was just said.** The closing section should add perspective, point forward, or acknowledge what was not covered — not restate the article in miniature.

# What to Avoid

- Passive voice when active voice is clearer
- Buzzwords without meaning ("leverage synergies", "paradigm shift")
- Excessive hedging ("it might be possible that perhaps...")
- Claiming exhaustive coverage when the treatment is intentionally focused
- Padding sentences to sound more formal or academic
- Referring to the reader as "the reader" — address them directly as "you"
