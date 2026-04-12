# app/posts

Blog article content for [andrew-codes.com](https://andrew-codes.com). Each article is written in MDX with YAML front matter.

## Front Matter

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

## File Layout

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

## Writing Style

- Use `##` for top-level sections within the article (the `title` front matter acts as the `h1`).
- Prefer tables for structured comparisons.
- Use blockquotes (`>`) for callouts and key takeaways.
- Write in first person; these are personal articles, not docs.
