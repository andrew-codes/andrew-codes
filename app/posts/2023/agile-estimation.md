---
aliases: [agile-estimation]
category: agility
date: 2023-11-14
date created: Thursday, June 5th 2025, 2:34:26 pm
date modified: Saturday, June 28th 2025, 12:39:19 pm
description: Understand the role of estimation and effective ways to utilize it.
linter-yaml-title-alias: agile-estimation
tags: [bucketing, estimation, featured, points, story]
title: Agile Estimation
---

## Overview

Estimating is a common practice in Agile software development. It helps teams understand the relative size of work and prioritize tasks. However, estimating can be time-consuming and often leads to inaccurate forecasts, making it ineffective for planning. In this post, I'll discuss the purpose of estimation and a more effective way to forecast project timelines in an [upcoming article](../2024/agile-forecasting.md).

> See [Agile Forecasting](../2024/agile-forecasting.md) for more information on forecasting project timelines.

## Why Do We Estimate?

Many believe that estimating helps determine how much effort it will take to complete a backlog of work. However, estimation is often inaccurate at predicting the future.

> Estimation is a poor planning tool and this is not its primary purpose.

If estimates were effective, projects would consistently meet their deadlines and adhere to original timelines. However, in my experience, timelines or scope are often adjusted to meet deadlines, indicating the original estimates were inaccurate. This suggests that more time is spent on estimating and planning than on delivering.

I can support this claim with empirical evidence, though I cannot release the data at this time. I encourage readers to review their own historical data to see if they find a similar pattern. Compare original estimates to actual delivery dates without any adjustments to the scope of the project.

There are better mechanisms to forecast project timelines, which I will discuss in a future post. The purpose of estimating stories is not for planning. So, what is the purpose of estimating stories?

### Why We "Actually" Estimate

<em>"You can't put ten pounds of stuff into a five-pound bag."</em> There are

always more tasks than there are people, time, and money to complete them.

Therefore, we are always faced with trade-offs: what work should we do next?

> Estimation helps prioritize work by understanding the trade-offs of the work's
> value and relative cost.

Prioritization is about making informed decisions on what to work on next. We cannot compare two tasks without knowing their relative cost. This is where estimation becomes helpful. Understanding that prioritization, not planning, drives estimation changes how we approach it. We focus on the relative size of the work, not the absolute size. This helps us make better decisions about what to work on next.

## Estimation Techniques for Prioritization

> Guiding principles for estimation: just enough accuracy, minimize time spent estimating, and focus on relative size.

1. **Just enough accuracy**: Estimates should be accurate enough to help make informed decisions and no more. Improved accuracy does not necessarily lead to better decisions.
2. **Minimize time spent estimating**: Time spent estimating should be minimized. The goal is to spend the least amount of time estimating to make the most informed decisions.
3. **Relative size**: Estimates should be relative to one another. We are not trying to understand the absolute size of the work, but the relative size.

### Skip Story Points

Story points are often debated among engineers. There is often a lack of consensus on the unit of measurement, the scale, and what the value represents (e.g., effort, complexity, time). This can derail estimation sessions. Instead, I suggest skipping story points. Here are a few reasons why:

> Reasons to skip story points: they often cause confusion and debate, require a great upfront cost for larger bodies of work, and reduce agility.

1. Story points can lead to confusion and debate over what the value represents.
2. Lack of clarity leads to inaccurate and inconsistent estimates.
3. Story points require a great upfront cost for larger bodies of work, reducing agility if there's a need to pivot.

To use story points for a larger body of work means either a single large story or a collection of related stories. In the first case, the story should be broken down further. In the second case, all related stories must be estimated to gain insight into the larger body of work. This is a significant upfront cost, reducing agility in two ways: increasing time to delivery and reducing the ability to pivot.

### Use a Bucketing Approach

A more effective estimation practice is to use a bucketing system. This means estimate values are one of only a few choices, streamlining the process and reducing time spent estimating.

> Streamline estimates into 3 buckets: small, large, and too large.

1. **Small**: Work that looks like all other "normal" work.
2. **Large**: Work that is unusually larger than the small bucket.
3. **Too large**: Work that does not fit into the first two buckets. This indicates the work is not well understood and should be broken down further.

Comparing unknown work to only two buckets is easier than comparing it to a larger range of values. This expedites the estimation process.

> The process of bucketing also reduces the spread of estimates, indicating the work is becoming better understood.

Over time, bucketing will reduce the spread of estimates. Work will either be one of two sizes, or it will be broken down until it fits. This means the work is becoming better understood, which is the goal of estimation.

## Final Thoughts

There is one gap in this article that I have not addressed. I have not discussed how to forecast project timelines. This is a critical piece of the puzzle that I will address in an [upcoming article](../2024/agile-forecasting.md). However, I hope I have convinced you that estimation is not the tool for planning. Instead, it is a tool for prioritization. Understanding this distinction will help you make more informed decisions about what to work on next.
