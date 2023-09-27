---
title: Powerful Pytest Parametrization
description: I absolutely love using pytest as my go-to testing tool whenever i'm working on a Python project. Pytest Parametrization is one of reasons why.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/pytest-param.webp
date: "2023-10-06"
tags: ["Python", "Pytest", "Testing"]
---

I absolutely love using pytest as my go-to testing tool whenever I'm working on a Python project. Among its many features, pytest's parametrization is a standout and has been crucial in simplifying my test cases and maximizing code reusability instead of duplicating tests.
What's more, if it's not clear, parameterized tests are being presented as different tests on each test execution and report.

I have been using it ever since I started using pytest for many different test types, such as unit tests, end-to-end tests, and integration tests.

Let's take a look at some real examples (although I had to make them a little bit more generic) of how to use pytest parametrization.

__Basic Parametrization__

The most straightforward use case is to feed multiple inputs to a single test function. This is useful for testing different edge cases or multiple data points without writing separate test cases.

In the example below we wrote a test function that asserts on the length of a string, while with parametrization we can test multiple strings with a single test function.
We provide test input (for example "hello") and the expected result (in this case 5).

```python
import pytest

@pytest.mark.parametrize("input_string, expected_length", [
    ("hello", 5),
    ("world", 5),
    ("pytest", 6)
])
def test_string_length(input_string, expected_length):
    assert len(input_string) == expected_length
```

__Indirect Parametrization__

With indirect, rather than passing the value directly to the test function, pytest will treat the given input as a fixture name. This allows us to use the fixture's logic to transform or process the input value before passing it to the test. Here, each number is doubled using a fixture before being tested.

```python
import pytest

@pytest.mark.parametrize("input, expected", [
    (2, 4),
    (3, 6),
    (4, 8)
], indirect=["input"], ids=["double-2", "double-3", "double-4"])
def test_double_number(input, expected):
    assert double(input) == expected

@pytest.fixture
def double(input):
    return input * 2
```

__Custom ID for Test Cases__

Sometimes it's beneficial to have custom names for our tests, especially when the default names become unclear or too lengthy. The ids parameter lets us define custom names for our tests. In this example, we use custom IDs to quickly identify tests for even and odd numbers using the `ids` argument that expects a list.


```python
import pytest


@pytest.mark.parametrize("number", [2, 3, 4, 5, 6],
                         ids=["ev-2", "odd-3", "ev-4", "odd-5", "ev-6"])
def test_even_numbers(number):
    is_even = number % 2 == 0
    if "ev" in pytest.current_test().name:
        assert is_even
    else:
        assert not is_even
```

__Parametrization with Multiple Arguments__

Here we demonstrate how to parameterize a test with multiple input arguments. We're testing the addition of two numbers. This is a powerful feature when we want to test a function with various combinations of inputs.

```python
import pytest


@pytest.mark.parametrize("a, b, expected_sum", [
    (1, 2, 3),
    (3, 3, 6),
    (5, 5, 10)
])
def test_addition(a, b, expected_sum):
    assert a + b == expected_sum
```

__Utilizing Parametrization in Asynchronous Tests__

With pytest-asyncio plugin (which is kind of standard these days), we can also parameterize asynchronous tests. In this example, we test an asynchronous function that returns a string after a built-in delay just for the sake of the example.

```python
import pytest
import asyncio

@pytest.mark.parametrize("input_str", ["hello", "world", "pytest"],
                         ids=["hello-async", "world-async", "pytest-async"])
@pytest.mark.asyncio
async def test_string_return_async(input_str):
    returned_str = await async_string_return(input_str)
    assert returned_str == input_str

async def async_string_return(s):
    await asyncio.sleep(0.1)
    return s
```

__Parametrization with Dynamic Fixtures__

The following test demonstrates a more complex usage of pytest's parametrization. This is especially the case when you have a dynamic fixture (like `dynamic_execution_payload`) which depends on the parameter passed (`path_arg` in this example).

```python
import pytest


BASE_URL = "http://example.com/api"


@pytest.fixture(scope="function")
def payload_for_execution(file_path):
    return {
        'repo': "demo-repo",
        'ref': "demo-branch",
        "paths": [file_path]
    }


@pytest.mark.parametrize('file_path', [
    'mock/testDir/file4.js',
    'mock/testDir/file3.js',
    'mock/testDir/file1.js',
    'mock/testDir/file2.js'
])
def test_file_processing_with_dynamic_payload(file_path, payload_for_execution):
    execution = requests.post(url=f"{BASE_URL}/startExecution",
                              headers={"Content-Type": "application/json"},
                              json=payload_for_execution)
    execution_id = execution.json()['executionId']
    
    response = requests.get(url=f"{BASE_URL}/getExecution/{execution_id}",
                            headers={"Content-Type": "application/json"})
    response_json = response.json()
    
    assert 'result' in response_json, "Response JSON does not have the 'result' key"
```

First we specified different file paths as inputs for the test function. For each of these paths.
With it we utilize the fixture `payload_for_execution` that generates a payload dynamically based on the `file_path` given and this payload is then used in our test. This demonstrates how you can use the parameters of your test in your fixtures, making your tests more dynamic and flexible.

Within the test, an HTTP POST request is made to presumably start some kind of processing for the file specified in the payload. This request returns an execution ID. A subsequent GET request fetches the result of this execution. Finally, assertions are performed on this result.

__Parametrization with Using Dates__

Dates in every language can be a true pain, therefore its important we tests them thoroughly.

```python
import pytest

from datetime import datetime, timedelta


@pytest.mark.parametrize(
    "input_date, expected_query",
    [
        (datetime(2023, 3, 15), "?start=2023-03-01&end=2023-04-01&category=premium"),
        (datetime(2023, 12, 31), "?start=2023-12-01&end=2024-01-01&category=premium"),
        (datetime(2023, 1, 1), "?start=2023-01-01&end=2023-02-01&category=premium"),
        (datetime(2023, 2, 28), "?start=2023-02-01&end=2023-03-01&category=premium"),
    ],
    ids=["mid-March", "end-of-year", "start-of-year", "end-of-February"]
)
def test_generate_query_based_on_date(mocker, input_date, expected_query):
    mocker.patch("module_under_test.datetime", MockDateTime)
    MockDateTime.now = mocker.Mock(return_value=input_date)
    assert generate_query_for_service(category='premium') == expected_query

def generate_query_for_service(category):
    now = datetime.now()
    start_of_month = now.replace(day=1)
    end_of_month = (start_of_month + timedelta(days=32)).replace(day=1)
    return f"?start={start_of_month.strftime('%Y-%m-%d')}&end={end_of_month.strftime('%Y-%m-%d')}&category={category}"
```

First we provide different datetime objects as inputs. For each datetime, there's a corresponding expected output. This is a classic example of table-driven testing. But in many scenarios, functions might fetch the current date and time using something like `datetime.now()` which can become tricky for testing, thats why you want to control what "now" means so you can predict the output. The `mocker.patch` (using pytest-mock plugin) line mocks the return value of `datetime.now()` to be the input date, allowing for predictable and testable behavior.

The hypothetical function `generate_query_for_service` is responsible for generating a query based on the current date and a given category. It's logic is simplified for this demonstration.

With this structure, you're dynamically testing the function with multiple dates, ensuring it works across various boundary conditions like month ends, year starts, etc.


To conclude,
Pytest parametrization is a powerful feature that reduces redundancy, improves test clarity, and enhances the reusability of test code. These are just a few examples showcasing its capabilities. Using parametrization, you can write more concise and robust tests, and that's without mentioning other out of the box plugins which support pytest.
