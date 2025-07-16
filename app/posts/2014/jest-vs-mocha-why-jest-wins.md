---
aliases: [jest-vs-mocha-why-jest-wins]
category: engineering
date: 2014-09-10
date created: Thursday, June 5th 2025, 2:34:26 pm
date modified: Saturday, June 28th 2025, 1:11:02 pm
description: >-
  An early assessment of the Jest testing framework and comparisons to mocha/karma.
featuredImage: cover.png
linter-yaml-title-alias: jest-vs-mocha-why-jest-wins
tags: [javascript, jest, mocha, tdd]
title: "Jest vs. Mocha: Why Jest Wins"
---

## Overview

When developing front-end applications, my TDD tool belt consists of karma, mocha, sinon, and chai. When I first learned of [Jest](http://facebook.github.io/jest), I was skeptical of the new JavaScript unit testing framework. After a bit of research and a sample project, I will tell you why I decided to switch, and here's why you should, too.

## Key Motivations for Jest

The biggest motivation to use Jest is stated clearly on their website: "_painless JavaScript unit testing_." I never really thought of my current workflow as being painful, but sometimes we learn more about ourselves from others. It was not until I used a significantly easier workflow before I realized how cumbersome mine is.

The "easier" part boiled down to three primary features:

- All dependencies are mocked by default
- Ease of setup and configuration
- Auto-magically finds and runs all your tests; no registration required

## To Mock, or Not To Mock? Shouldn't Be a Question

Unit tests predominantly test two things: a unit of work **in isolation** and its **collaboration** with other things. Isolating a work unit from dependencies and asserting its correct use with collaborators requires these dependencies to be mocked or faked. Generally speaking, you will mock all of your dependencies. The majority of other testing frameworks, JavaScript or otherwise, requires you to mock your dependencies explicitly.

While explicit mocking seems fair, this may be attributed to everyone else also following this mentality. The vast majority of the time, you need to mock all dependencies except for the subject under test. Not mocking a particular dependency is typically an edge-case. If we usually mock everything but the SUT, why do frameworks have us do the exact opposite, not mock the SUT and explicitly define our mocks for everything else?

Here I agree with Jest's approach. Jest automatically mocks all dependencies unless otherwise specified. It allows us to set up our mocks for what is relevant to the test in question but still have all other dependencies be fakes. It also means that changing interactions with collaborators is quicker—no need for the unnecessary setup of a fake.

## Configuration Has Never Been Easier

If you use mocha/karma with CommonJS modules, you know those module paths can sometimes bite you, especially when configuring karma. I have come across various directory structures, and I have run into some path-related issue when configuring the client-side testing stack.

### Mocha Experience

1. Create your karma config file
2. Include mocha, sinon, and chai karma frameworks, as well as the plugins for them ([karma-mocha](https://www.npmjs.org/package/karma-mocha), [karma-sinon](https://www.npmjs.org/package/karma-sinon), [karma-chai](https://www.npmjs.org/package/karma-chai), and [karma-sinon-chai](https://www.npmjs.org/package/karma-sinon-chai)).
3. Don't forget to include a karma plugin for your browser (IE, PhantomJS, Chrome, etc.)
4. Include your source files and test files by registering them with karma
5. Exclude your source files to prevent duplicate loads
6. Include third-party dependencies to be used as CommonJS modules

> - Using bower? Either explicitly add every bower package's main file to the config file or write custom code to pull them and translate them properly
> - Using a CDN for some? Don't forget to include these explicitly

1. Don't forget to exclude your node_modules folder from being processed as CommonJS modules
2. Don't forget to include configuration for the plugins that enable you to use CommonJS with karma ([karma-common-js](https://www.npmjs.org/package/karma-commonjs)).
3. Create a test. Mock any require statements needed for the module and test.
4. Run `karma./path/to/karma.config.js.`

### Jest Experience

1. Create a `__tests__` directory to contain your tests.
2. Create a test. Tell Jest not to mock the SUT and setup any fakes required.
3. Run `jest` from the command line.

### What about…?

**What about the third-party dependencies?** What if my module or test needed jQuery from a bower_components directory? Or a CDN? How does it know where to find jQuery? The simple answer is it doesn't matter because it is a mocked dependency!

**What about telling it where the test files are or where the source files are?** Jest takes care of that by using the convention that all your tests are in the `__tests__` directory.

**What about the DOM manipulations?** It utilizes `jsdom` to allow the testing of DOM operations.

## Final Thoughts

Overall, I am quite impressed with Jest. I am impressed enough to adopt it as my standard for client-side unit testing and recommend it to anyone else working with TDD for front-end development. However, there was one noticeable drawback: it is a little slow to run your tests. Compared to mocha/karma, it takes longer to run your tests. How much longer? Noticeable. Too long? Up for debate. Honestly, with all the benefits it brings to the table, I am ok sacrificing a little bit of test runner speed.
