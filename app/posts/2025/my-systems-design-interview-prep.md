---
aliases: [my-systems-design-interview-prep]
date created: Saturday, June 28th 2025, 12:06:10 pm
date modified: Saturday, June 28th 2025, 12:38:33 pm
linter-yaml-title-alias: my-systems-design-interview-prep
tags: []
title: My Systems Design Interview Prep
---

## Overview

Systems design interviews are a critical part of the hiring process for many senior and staff-level software engineering roles. They assess your ability to design scalable, reliable, and maintainable systems.

## Diagramming Test

```d2 width=300px
Customer
Onboard
Customer SQL DB {
	shape: cylinder
}

Customer -> Onboard: 1. POST TLD
Onboard -> Customer SQL DB: 2. stores TLD
```
