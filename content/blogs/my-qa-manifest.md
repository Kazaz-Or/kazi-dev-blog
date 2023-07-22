---
title: "My QA Manifest As a QA Team Lead/Manager"
description: As a former QA Engineer/Team Lead/Manager, I've learned a lot about the QA world. Here are my thoughts on what makes an excellent QA team
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80
date: "2023-07-23"
tags: ["General", "QA"]
---

Having worked in the software Quality Assurance for many years both hands-on and in different management roles, I've learned a lot about the QA world, especially working on different discipline (from hardware-embedded, through web & cloud, to mobile and desktop applications).

During my career i've joined a small startup company as a sole QA engineer with working with many developers and managers. During time we grew and I had to assemble a team from scratch. Because we were a start up company with a huge lack amount of time (obviously), i've decided to build an aim for building a very specific team, and for this to be possible, i've started working on my own QA Manifest that will fit the company's needs (and to be honest - my own needs as well as a team lead).

For those who are coming from the QA world, some of these guidelines might seems extreme but I believe that if you want to build a strong team, you need to have a strong foundation and bold guidelines.

So, here it is, i'll try to share as much as I can:

## Goals and Values

- We know our Products the best

- We know our Stack (you'll be surprise to know how many engineers I have interviewed that didn't which technology they are working with, from programming language to their cloud provider).

- We are aware of everyone’s work in our team (This will be one of the key tools for the QA engineers in the team to become enablers & enforces).

- We aim for quality

- We are the enforcers of our squads & enablers of our developers.

- We optimize the Development & Testing process

- We balance between quality and cost efficiency 

- We ensure proper documentation and communication

- We aim for Automated testing 

- We aim for continuous improvement in all aspects

- We are the quality gate keepers of our company

This manifest is basically the foundation of the QA team, and it's the QA team lead/manager responsibility to make sure that the team is following it.

## Test Plan Process

Test plans are acting like an anchor for designing, execution, reporting, tracking and other activities related to the testing project. The below are queries related to test plan which should guide us on how to start building our test plans.

__What guides us while building our test plan :__

- Analyze the product (Feedback & questions for Product)

- What needs to be tested ? (Scope)

- How testing will be performed ? (Manual / Automated / Semi-Automated)

- What is required ? (Testing tools, Internal tools, Clients, Environments, etc.)

- Are there any Risks ? (Focusing on complicated areas of our product will help mitigate risks)

- Our bugs (old & new) are covered as part of the test plans? (Will help increase the coverage & create more deep dive tests)

- Taking our product / SW to its extreme edges (If it’s performance, edge cases, etc.)

- Try to focus on the user’s point of view (Is the UX sufficient in your eyes? who will use the product? What will be the main use cases? etc.)

__What should be our main References :__

References to various documents which are used in the company, such as :

- Requirements specification (Epics, stories, specs, etc.)

- Design document (from HLD, Flow Diagrams, technical specs, etc.)

- User guides

- Process/product documents

- Developers feedback

- Reference from previous versions and comparison (GA’s for example)

- Bugs

__How to Define Tests Objectives and what will help us do it?__

Test Objective is the overall goal and achievement of the test execution. In most cases the objective of the testing is finding as many software defects as possible; ensure that the software under test is bug free before release, enhance our confidence in the product and ensure our product is stable even in extreme cases.

To define the test objectives, it is recommended to do the following steps:

- List all the software features (functionality features, performance, GUI…) which may need to test.

- Make sure the expected result of each use case is compliant with high standards.

- Check that the external interface of the product such as UI is working as expected and & meet the customer need (UX). (You can see the example taken from a demo test app (Guru99 bank) below).

- Splitting the tests by their testing type (which at the release phase we can even decide which types we would like to test, such as Sanity, Happy path, Negative, Edge Cases, Error Cases, etc).

![guru99-demo](/images/guru99_demo.png)


| Advantages      | Disadvantages |
| ----------- | ----------- |
| Better and clearer test execution reports      | Not easy to divide to features in an efficient way       |
| Can provide us a better view on the “bad” areas in our product    |        |
| Can provide us coverage strength per feature   |      |
| Helps us differentiate between releases and coverage improvement   |        |


__Test Deliverables:__

- Test plans (to ensure coverage)

- Test execution reports 

- Bug Reports 

- Dashboards (Coverage, bugs, content, etc) 

- Test summary reports

- Contribute to release notes if required. 

- Handover of the release if required

- Summary email to wider distribution of relevant people

## Test Plan Reviews

Test Plan review is a critical part on our way to create a high standard test plan for our product/feature.

Test plan is not a document to cope with hands down. On the one side, it is difficult to create it and not to miss important information or carry it so that the client gets all the details. On the other side, you should have the experience to check a test plan to make sure it covers all the necessary details and that the testing provider gave the relevant information. That's why a review is fairly important.

__Types Of Reviews__

- Reviewing your own work – Self Checking

- Peer Review - Within the team (including developers)

- Supervisory - Being handled weekly in a QA forum (chapter, guild, etc.) with QA Engineers from other teams and the QA leads.


__When / Who / What / Why?__

_Who_ - 
Peer review should be according to the team effort and scope. In most cases it’ll include all QA engineers within the team, Team Lead and a relevant SW Engineer.
Is some cases the entire team take part is such review, but it might be according to the scope of the test plan - It’s yours to define what is the most effective way.

_When_ - Because it can be overhead, I would recommend doing such review in three cases - 

Reviewing test plan for a specific features (basically once a set of user stories are completed in terms of QA). I would recommend to do more deep dive into the tests (tests are kept as a simple flow, expected result is as defined, etc).

Reviewing at the end of each Sprint (by definition the review can be more high level to see we’re not missing anything from the scope or not testing too much out of the scope & and enhancing user scenarios).
Also, deciding what can be translated to Automated test.

Reviewing test plan for release - See that we’re testing to a point of striving to the maximum quality of the delivery which is in our scope. You should focus on features to be tested and high level review of the test cases.
Also, if there are cases which we decided not to include some tests / features in our test plan - Review this decision also.

_What_ - 
So what is our guidelines in terms of test plan review?

- Ensure that we satisfy all project requirements

- Ensure that we’re fully covering the functionality

- Ensure that the test are also exploring edge & error cases to see how our product reacts in extreme cases or smart ass users.

- Ease of understanding

_Why_ -

For exactly the same reason we test the software - 

- To uncover errors

- To check for completeness

- To make sure the standards and guidelines are as expected

- Approaches to consider for test design

- In order to ensure the product quality

- Tests cases are a great documentation to share our testing coverage (for both manual and automation tests)

## Testing Convention

__Generic Tests with Clear headlines and minimal steps (Breaking down steps into tests)__

Tests should be Generic as much as we can with a clear headline, so in most cases we won’t have to drill down to each tests to understands it’s scope and the reason of failures.

One of my golden rules, if a step can fail by itself, it means it should be covered as a test in most cases.

There are couple of emphasizes to make a generic test plan

- Each test should include it’s feature name at the start of the test name (this is mostly for reports / tracking purposes). 

- Each testing variable in the test can be split into different test which will make it easier to differentiate in case of failures.

- Less steps breakdowns - In most cases, if a step can potentially fail - It means its should be a test by itself instead of a step as part of a bigger tests. 
We do this to insure we know which TEST was failed and not which step. In addition, steps should be generic as much as we can (not fully detailed).


Let's see an example below from one of my test plans - 

![testplan](/images/testplan-matrix.jpeg)

Do we really need steps? Or is it clear by the headline itself?

On which test plan it’ll be clear enough to understand exactly what test failed?

On which one we have more chances to miss something?

Of course, this method won't fit in any feature/product, but again, from my experience, it's a good practice to follow because most of them will fit.

Let's take a look at some cons and pros of this method:

| Advantages      | Disadvantages |
| ----------- | ----------- |
| Easier to see the big picture      | Less convenient for new employees       |
| Enhancing the coverage per feature    | Requires strong documentation (which we’ll do regardless)         |
| Separation per a tests variable    | Less detailed test, in some cases will result in a longer learning curve        |
| More coverage    | Preliminary work on test plan will require additional time         |
| Less time consuming when analyzing failures    |       |
| Less “misses” on verification and regression tests    |        |
| Helps us cover edge cases     |     |
| Easier to maintain     |     |
| “Forces” engineers to fully understand the workflow and guidelines of the product     |     |

__Linked to Bugs (almost all bugs should be covered by tests)__

As best practice, almost every bug / ticket with QA verification can be translated into tests. In this case we know for sure we have coverage for a use case that was already defected and/or helps us not to miss any use case for future executions.

__Technical Details (like how to) should be linked to our knowledge sharing platform__

Lots of engineers like to fill this data in their steps, which eventually makes it much harder to maintain. In our case, we provided a link to the relevant Confluence page which includes all the technical details.
Regardless of tests plans, we must “own” the feature. Huge part of it is a strong documentation that we can modify in one place and share with other team members.

__Unlike Waterfall model, tests order (or hierarchy) isn’t a must. We should be able to execute tests as a stand alone without any pre-condition of other test cases or test suites__

At some point, we would like to test a specific test or a feature in a manual or automated way. Working without pre-conditions will help us execute tests in a more agile way.


__Test Structure and mandatory fields:__

Each test should include the following:

- Test Header should include clear scope of the test -

Feature - Test Type (for example; Sanity, Performance, Negative, etc) - Test Name (or Actions, depends) - Test Parameter (if required)

For example from my old test plan:

VOD Playout - Sanity - Play VOD File - HLS CLEAR

- Description - A short description of the purpose of the test. Link to a How-to Confluence page if required.

- Feature field - Each test should be related to a specific feature that we will be able to select from a list in Jira.

- Component field - Free text - We should add the Component/Microservice/Process that is relevant for the test to pass.

- Test Type - Manual / Automated.

- Fix/Target Version - The version that we added the test

- Linked Issue - Tests that are related to a specific bug that was translated to a test, should be linked to the bug, event if it’s an old bug that is already closed.


## QA Workflow & Methodology in Squads/Scrum Teams

General guidelines:

- QA Engineers should aim to have have their own “production-like” testing environment (if possible of course).

- As best practice, almost all Stories / Tasks / Bugs should be assigned to QA verification with clear testing instructions (if required) and regression testing recommended if needed (Anything that might have a functional effect on the product).

- QA Engineers should be on top of every change merged in their team, make sure you’re always aligned and on top of the current status.

- Make sure issues found are documented using Bugs in Jira, this will help track the status, and help us improve test plan.

- We have to be on top of the bug list in our domain.

- In terms of bugs, we have to use a clear description and try to find the balance between clear description for debugging purposes and for customer impact point of view mainly for people that are not part of the squad.

- We have to be clear about Reproducibility - For example: it the bug persists every time? Sometimes?

- We have to have a clear scenario and steps to reproduce.

- We have to set Severity / Priority according to business logic.

- When possible, we need to add as many evidence as we can, such as log, status code responses, screen shots, videos, etc.

- Control all bugs in the team, make sure you’re familiar with them, make sure from time to time they are relevant.

- QA Engineers should work closely with Automation engineers to make sure their coverage is being covered in an efficient way also in automated test runs.

- Infra Automation should be user-friendly so anyone in the squad can enhance out automation coverage in the team (QA, DEV).

There are plenty more guidelines, but these are the main ones that I believe are the most important. I had great success and with this method and I hope it will help you as well even if you agree with some of them.

In addition to that, one of the articles I liked to reference for new engineers in my team is this article - [Is There Any Start And Stop Boundary To The QA’s Role In Scrum?](https://www.softwaretestinghelp.com/qa-role-in-scrum/).

Thanks for reading, and I hope you enjoyed it!
