---
title: 'What is CI/CD - A brief introduction'

description: 'Before the discovery of continuous integration and delivery, the traditional process of collaborating and delivering software was slow, error-prone, and cumbersome. It involves manual testing, building, and deployment of code to end users.'

date: '2023-06-19'

lastmod: '2024-09-20'

categories:
  - python
  - tips

published: true
---

## Introduction

Before the discovery of continuous integration and delivery, the traditional process of collaborating and delivering software was slow, error-prone, and cumbersome. It involves manual testing, building, and deployment of code to end users.

Along with the hassle of development, deploying to end users was even more hassle and a process to carefully monitor and supervise to avoid an error.

CI/CD swoops in like a heroic champion, introducing a new method to efficiently merge code from multiple developers, uncover bugs and integration problems early on, and have your application pass a predefined test before building the end product. This ensures a seamless delivery of software and a more stable codebase.

## What is Continuous Integration (CI)?

Continuous Integration (CI) is a practice that involves a continuous push of code changes from multiple developers to a shared repository, where automated tests and builds were executed to detect bugs and integration issues early on.

This practice allows for more agile development, as you can quickly experiment with new features and spot issues that may arise during a large-scale code integration.

Since CI integrates smaller, incremental changes more frequently, it paves the way for seamless collaboration among developers and creates a more stable codebase that is always ready to go live.

## Fundamental elements of continuous integration

- ### Version Control
  Every continuous integration process starts from a commit to a repository. The developers mostly use version control software, such as Git to manage and collaborate on a single codebase.
  check out my article on [introduction to git](https://www.abdulmumin.com/git-beginners-guide)
- ### Events
  After the developer commits, or we can say add some code to the repository, such action can identify as an "event". A sequence of steps then is wired to such events.
  In Continous Integrations, adding code to a shared repository triggers a series of automated tests.
- ### Automated Test
  This process of the continuous integration pipeline runs all tests and performs other actions such as Linting, Formatting, and others.
  This process is triggered by an event in the code repository.
- ### Automated Build
  CI relies on an automated build system, this process is triggered by an event.
  This process compiles code, resolves dependencies, and generates executables or deployable artifacts.
- ### Feedback
  After the completion of every pipeline, a report of the entire process is shared with the team, and are notified of any issues that need attention.

## What is Continuous Delivery (CD)?

CI alone doesn't quite achieve that entire goal, which includes getting the product to the end users. It is mostly a process of rigorously testing every new code change to ensure safe delivery to the end users.

Continuous Delivery automates the entire software delivery pipeline and eliminates the hassle of error-prone manual deployment. It ensures code passes through all stages of the deployment process, simulates a production-like environment for testing, and ensures a safe release to production.

Continuous Delivery follows through predefined stages, often called **_pipelines_**, which is a sequence of tasks to be executed in a specific order to test, build and deploy applications.

## Process of Continuous Delivery

- ### Version control integrations
  The pipeline begins when a developer commits changes to a repository. It monitors changes in the repository and triggers subsequent pipeline stages.
- ### Build stage
  In this stage of the process, code dependencies are fetched and the program is compiled into executable or deployable artifacts.
- ### Testing stage
  The pipeline includes more than one test where automated tests, such as unit tests, integration tests, and other required tests are executed. This process is to verify the functionality, quality, and stability of the code changes
- ### Artifact storage
  The process might include artifacts such as binaries or container images that are needed for deployment. These are then stored in a repository or custom storage for easy access and retrieval.
- ### Deployment stage
  This process involves automating the deployment of software to various environments, such as development, staging, and production. it includes steps to provision infrastructure, configure applications, and release to a target environment.
- ### Report
  Feedback or report of the entire Delivery process is logged and shared with maintainers of the project.

## Conclusion

Continuous Integration (CI) and Continuous Delivery (CD) are transformative practices that revolutionize the software development and deployment processes. CI focuses on frequent code integration, automated builds, and testing to catch issues early and ensure code stability. CD extends CI by automating the entire software delivery pipeline, including deployment and release processes.

By adopting CI/CD practices, development teams benefit from faster release cycles, reduced manual errors, increased collaboration, and improved overall software quality. CI/CD enables teams to deliver software reliably and efficiently, with the ability to quickly respond to changes and deliver value to users in a timely manner.

The combination of CI and CD streamlines the development workflow, reduces risks, and enables teams to release software with confidence. It fosters a culture of continuous improvement, automation, and collaboration, empowering teams to focus on innovation and delivering high-quality software. With CI/CD, organizations can achieve faster time-to-market, increased productivity, and enhanced customer satisfaction in today's fast-paced and highly competitive technology landscape.
