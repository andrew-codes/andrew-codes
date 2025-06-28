---
aliases:
  - systems-design-interview-prep-guide
category: engineering
date: 2025-06-28
date created: Saturday, June 28th 2025, 12:06:10 pm
date modified: Saturday, June 28th 2025, 6:58:20 pm
description: "I've compiled a guide for systems design interviews for senior and staff-level engineers."
linter-yaml-title-alias: systems-design-interview-prep-guide
tags:
  - featured
  - systems-design
title: Systems Design Interview Prep Guide
---

## Overview

Systems design interviews are a critical part of the hiring process for many senior and staff-level software engineering roles. I'd like to share my notes and preparation material that I've collected on the topic. This post will provide a structured guide to help you prepare for your next systems design interview.

## Problem Approach

Below is a framework of how to break down a problem into discrete sections and how much time to spend on each one. You will typically **only have 50-55 minutes** for the interview, so time management is critical. I've provided general guideline for how to time box each step.

| Step                       | Time         |
|:------------------------- |:----------- |
| Feature Expectations       | 10 mins      |
| Estimations                | 5 mins       |
| High Level Design          | 10 mins      |
| Deep dive                  | 15 - 20 mins |
| Justification              | 10 mins      |

## Step 1: Feature Expectations (10 mins)

This first step is critical as it sets the tone and direction for the remainder of the interview. Ask questions to clarify the system's uses cases. The purpose is to quickly identify **key features** and those that can be considered out of scope for the sake of the problem. Some prompt questions to help you ascertain these:

- Who are the users and, more specifically, what are their goals in using the system? Which of these goals is most important to them?
- What does the system do? Are there any goals determined by the business?
- What size system are we anticipating needing to build? Specifically, how many daily active users are we expecting on average and at peaks?
- What are users' usage patterns in how they use the system?

Outline or even quickly write down a summary of the major requirements of the system. You'll use the answers from your questions to drive these statements. This is also the time to discuss non-functional requirements; again based on the primary use cases. **Focus on only the top 3 use cases.** Others can be outlined as out of scope.

## Step 2: Estimations (5 mins)

This step is all about back-of-the-envelope estimations. These insights will help **guide your decisions** on **technology choices** and **overall design** of the system.

One critical metric to identify is the read/write ratio for requests. This can be inferred based on the primary uses cases and users' patterns or behaviors when using the system. Depending on this ratio, you may find the system needs to be optimized for reads over writes or vice versa.

Secondly, calculating requests per second based on daily active users and their usage patterns will provide you insights into what parts of the system are likely to experience the highest loads; this information will impact the design also as you try to cater the system to meet these demands.

Finally, you may be asked to determine storage needs, i.e., how much storage space is required for the system to operate. This may influence decisions around storage options.

## Step 3: High Level Design (10 mins)

The high level design communicates the paths in which data flows in the system via diagrams. My recommendation is to **focus on and communicate one use case at a time**. This naturally allows you to tell the story of the system incrementally, which will be easier for the interviewer to follow along.

Often, a single use case will be a single flow of data; of which will either be a read or write path. Start with simple components and, as you come across places that require more, introduce the additional components at that time in the explanation. Be sure to communicate your thought process for why these components are being introduced and what trade-off is being made in doing so.

Here is an example diagram. It depicts (only) the write scenario of the read-heavy system of a URL shortener. In this example question, users may shorten or brand URLs under a provided top level domain (TLD).

```d2
End User
Customer -> API Gateway -> Shortener: A1. POST
End User -> API Gateway -> Redirect: B1. GET
Redirect -> End User: B4. 302 redirect
Shortener -> Customer SQL DB: A2. validates domain
Shortener -> NoSQL DB: A3. URL, keyed by\nshort URL
Redirect -> NoSQL DB: B3.1 update cache\non miss
Redirect -> Cache: B3. longUrl

Cache: Redis {
	shape: cylinder
}
Customer SQL DB {
	shape: cylinder
}
NoSQL DB {
	shape: cylinder
}
```

Additionally, as you are walking through each use case, identify key areas that will require additional thought or explanation. For example, in a URL shortener, every URL will need a unique and short identifier. You can mention these key areas as places to be followed up on in the next phase.

## Step 4: Deep Dive

This is where you can dive into those critical areas that were identified in the previous step. These represent some of the more challenging implementations in the system and this provides you an opportunity to speak to how they will be solved.

## Step 5: Justification and Trade-offs

Finally, you close by discussing your justifications for why certain trade-offs were made. Every decision on technology choice and design will come with trade-offs. Decisions should align with the system's goals and use cases. It is important to not only communicate these trade-offs, but reason through what guided your decision making process.

## Conclusion

Preparing for systems design interviews requires a structured approach and clear communication about your design decisions. By following this framework--clarifying key features, performing quick estimations, sketching a coherent high-level design, diving into critical details, and articulating trade-offs--you'll demonstrate the depth of thought and clarity expected at staff-level engineering roles. Practice this approach consistently, and you'll become comfortable handling even the most complex system design questions.

> Note, I've published my [full set of notes](ttps://andrew-codes/github.io/interview-prep) and they may be found on the web, including practice problems and solutions. Note that these are a work in progress.
