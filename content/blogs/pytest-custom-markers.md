---
title: "Organizing Your Tests with Custom Markers in Pytest"
description: This is the easiest way to categorize and maximize the flexibility and readability of your testing workflow and results
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/pytestcustommarkers.jpeg
date: "2023-03-27"
tags: ["Python", "Pytest"]
---

Pytest is a powerful and flexible testing framework for Python that allows developers to easily write and execute test cases for their code. One of the key features of pytest is the ability to use custom markers to organize and categorize tests in efficient way.

Custom markers in pytest are user-defined labels that can be attached to individual tests, test classes, or entire test suites. These markers can be used to provide additional context and information about the purpose and intent of each test, which can help developers better understand the test results and identify issues more quickly.
For those of us who had the chance to write down manual tests - You should be familiar with the above.

There are several advantages of using pytest custom markers in your testing workflow:

**Improved organization and readability:** Custom markers can help organize tests into logical categories, making it easier to navigate and understand complex test suites. For example, you might use markers to group tests by feature, priority, or level of complexity.

**Flexible test selection:** With custom markers, you can selectively run subsets of tests based on their markers. This can be especially useful when you have a large test suite and want to focus on a specific set of tests, such as those related to a particular feature or module.


In a small Test Automation project I had a chance to take part in, at some point we wanted to differentiate between tests that will be executed on each uploaded Pull request, and for heavier test to run in a nightly scheduled job.
Pytest custom markers was such an easy solution. 

In your pytest.ini file just use the markers tag and create as many markers as you like.

```python
[pytest]
markers =
    sanity:Run only tests marked as sanity
```

From there you can mark the tests you'd like to tag with the pytest mark decorator.
This is a small test from my project as an example:

```python
@pytest.mark.sanity
def test_leave_room_sanity(self, get_default_parameters, room_id_private_after_join):
    ec_api.leave_room(room_id=room_id_private_after_join, **get_default_parameters)
```

Now if you want to run only the tests with the custom marker you created, simply run pytest command with -m flag and the marker name.

```bash
pytest -m sanity
```

You can also run all the tests that aren't marked with the marker you created by running a reverse command.

```bash
pytest -m "not sanity"
```

There are many more advantages we can leverage using custom markers, such as:

**Customizable reporting**: Pytest's reporting system can be customized to display information based on the markers attached to each test. This allows you to generate more detailed reports that provide additional context and insights into the test results.

**Integration with other tools**: Custom markers can be used to integrate pytest with other tools and systems in your development workflow. For example, you might use markers to trigger automated deployments or trigger additional testing based on the results of certain tests.

Overall, custom markers are a powerful feature of pytest that can help developers write more organized, readable, and flexible tests. By using markers to categorize and label tests, developers can better understand their test results and identify issues more quickly, leading to a more efficient and effective testing process.
