---
title: "GitHub Actions for Dynamic Cross-Platform Testing"
description: Automate cross-platform testing with GitHub Actions, using dynamic matrices for efficient, targeted tests.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F4b99jarovt77f7af9wwo.png
date: "2024-02-13"
tags: ["Testing", "DevOps", "JavaScript"]
---

Ensuring consistent application performance across multiple platforms is a cornerstone of quality software delivery. In this post, I'll share my approach for using GitHub Actions to automate testing across a variety of platforms, drawing from a real use case at my workplace.

Our solution utilizes GitHub Actions, a CI/CD service that enables automation of build, test, and deployment workflows directly within GitHub. The highlight of the approach is the dynamic matrix strategy, which handles both scheduled runs and on-demand tests across specified platforms.

__Scheduled and On-demand Testing__

In this example, the workflow is being triggered automatically at 22:00 every day for nightly tests. Additionally, we enabled manual triggers for specific platforms, allowing for targeted testing as needed. This flexibility is crucial for maintaining a fast-paced development cycle without compromising on quality.

```yaml
on:
  schedule:
    - cron: '0 22 * * *'
  workflow_dispatch:
    inputs:
      platform:
        description: 'Choose platform to run the test on'
        required: true
        type: choice
        options:
          - webos
          - tizen
          - playstation4
          - playstation5
          - xbox
```

This configuration leverages the `schedule` and `workflow_dispatch` events in GitHub Actions. The `cron` syntax schedules automated test runs, while `workflow_dispatch` allows for manual execution with platform-specific parameters.

__Dynamic Test Matrix Configuration__

The core of our workflow dynamically adjusts the test matrix based on the context of the trigger—whether it's a scheduled job covering all platforms or a manual job focusing on a specific platform.

```yaml
jobs:
  setup-test:
    runs-on: ubuntu-latest
    outputs:
      platform: ${{ steps.set-matrix.outputs.platform }}
    steps:
      - id: set-matrix
        run: |
          if [ "${{ github.event_name }}" = "schedule" ]; then
            echo 'platform=["webos", "tizen", "playstation4", "playstation5", "xbox"]' >> $GITHUB_ENV
          else
            echo 'platform=["${{ github.event.inputs.platform }}"]' >> $GITHUB_ENV
```

In this snippet, we employ conditional logic to populate the platform variable differently based on the trigger type. For scheduled runs, we test across all platforms, while manual triggers allow for focused testing on a selected platform. This strategy ensures that resources are allocated efficiently, focusing our testing efforts where they are most needed.
Of course, you could always do that with an external script or with a composite action, but this is a simple and effective way to achieve the same result.

__Executing the Tests with Dynamic Configuration__

Our approach to executing tests in this workflow benefits significantly from the dynamic nature of GitHub Actions, especially when it comes to handling multiple platforms which can be quite different from each other. This flexibility is further extended into our application's `package.json` file, where we define specific scripts for our testing needs. The `package.json` plays a crucial role in integrating the GitHub environment variables directly into our test execution process.

Without getting into the tests code, you can imagine that each platform has its own specific tests and configurations, and that's why we need to run the tests separately for each platform. This is where the dynamic matrix comes into play.


```yaml
- name: Run tests
  working-directory: ./src/lr-launcher-e2e
  env:
    npm_config_env: ${{ matrix.platform }}
  run: npm test
```

Here, the `npm test` command is executed within the context of each platform specified by the dynamic matrix. This ensures that our E2E tests are relevant and efficient, automatically adapting to the complexities of multi-platform support.

Here's a look at the relevant part of our `package.json` file:

```json
{
  "name": "lr-launcher",
  "version": "1.0.0",
  "scripts": {
    "pre-test": "node ./utils/setupTest.js --",
    "test": "mocha \"tests/*.test.js\" \"tests/$npm_config_env/*.test.js\" --no-timeouts --retries 1 --exit"
  },
  "dependencies": {
    "axios": "^1.6.2",
    "mocha": "^10.2.0",
  }
}
```
This script utilizes the `npm_config_env` environment variable, which we set dynamically based on the selected platform in our GitHub Actions workflow. By incorporating `$npm_config_env` into the mocha command, we ensure that the test runner picks up not only the general tests from tests/*.test.js but also platform-specific tests located in directories named after each platform (e.g., tests/webos/*.test.js).

This setup allows us to maintain a clear and organized test structure where platform-agnostic tests are separated from those that are platform-specific. It ensures that when our GitHub Actions workflow runs, it only executes the relevant tests for the specified platform, making our testing process both efficient and comprehensive.
