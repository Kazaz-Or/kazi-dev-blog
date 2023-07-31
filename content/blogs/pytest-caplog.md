---
title: "Capturing Logs with Pytest Can't Be Easier"
description: Pytest's built-in caplog fixture to capture log messages is nothing but amazing. Capture logs for unit testing can't get easier
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80
date: "2023-08-01"
tags: ["Python", "Pytest", "Testing"]
---

When it comes to testing in Python, pytest stands out as an excellent framework with its rich feature-set that includes detailed info on failing assert statements, auto-discovery of test modules, and advanced fixture management. While working on unit testing for one of our python services at work I wanted to test some scenarios that involves some more critical logging for debugging at real time. 

Taking a look at [pytest official docs](https://docs.pytest.org/en/7.1.x/how-to/logging.html) I got to know the `caplog` fixture. I had many cases before where I actually found better solutions from built-in fixtures, but this time I was amazed by how easy it was to use and how much it can do. And it's safe to say I never looked back when it's comes to logging capturing in pytest.

__So what is caplog?__

In pytest, caplog is a fixture provided by pytest, which captures log messages emitted by the logging module. This allows you to validate that your application is logging the right messages or to debug a test by capturing and examining the log output and the log level.

Let's start with a concrete test case to illustrate caplog's usage:

```python
import pytest
import logging

def test_logging(caplog):
    logging.getLogger().info("Test logging")
    assert "Test logging" in caplog.text
```

In the test above, we import the caplog fixture from pytest. We then log an info message and assert that the message is present in the captured log text.


While caplog is great for checking that a specific log message was output, it can do a lot more. You can use it to validate the level of logging messages, check the logger that issued them, and even change the log level for the duration of the test.

Here's an example where we're doing more advanced checks:

```python
def test_logging_advanced(caplog):
    caplog.set_level(logging.INFO)
    logger = logging.getLogger("TestLogger")
    logger.warning("This is a warning")

    assert "This is a warning" in caplog.text
    assert caplog.records[0].levelname == "WARNING"
    assert caplog.records[0].name == "TestLogger"
```

In the example above, we first set the logging level to INFO, then log a warning message. Afterwards, we assert that the message is in the captured log, but also that the level of the message is WARNING and that it came from the logger "TestLogger".

You can also assert messages from specific loggers:

```python
def test_logging_from_specific_logger(caplog):
    logger = logging.getLogger('MyLogger')
    logger.error("An error message")
    assert "An error message" in caplog.text
    assert caplog.records[0].name == "MyLogger"
```

In this test, we create a logger with the name 'MyLogger', emit an error message, and then confirm that the message was logged by that specific logger.

In some cases, you may want to clear the messages captured by caplog. This is particularly useful in parameterized tests or when a single test function is checking multiple scenarios.


```python
def test_clearing_log_messages(caplog):
    logger = logging.getLogger()
    logger.info("First message")
    caplog.clear()

    logger.info("Second message")
    assert "First message" not in caplog.text
    assert "Second message" in caplog.text
```

Here, after logging the "First message", we clear the caplog. Then we log the "Second message" and check that the first message is not in the captured log, while the second message is.

There are some cases where the tested function or method may produce multiple logs. In such cases, you can use the caplog.records list to check the log messages. This list contains all the log records captured by caplog, and you can use it to check the log messages, levels, and loggers.

```python
import pytest
import logging

def function_that_logs():
    logger = logging.getLogger()
    logger.warning("This is a warning message")
    logger.error("An error has occurred!")
    logger.info("Completed operation successfully.")

def test_log_capturing(caplog):
    function_that_logs()
    log_messages = [record.message for record in caplog.records]
    assert "This is a warning message" in log_messages
    assert "An error has occurred!" in log_messages
    assert "Completed operation successfully." in log_messages
```
In this example, the function_that_logs() generates multiple log messages of different levels: WARNING, ERROR, and INFO.

Our test test_log_capturing() invokes function_that_logs(), captures the log messages into a list, and then verifies each of the expected log messages is present in the captured logs.

Note that caplog by default captures log messages of WARNING level or higher. So if you need to capture lower-level messages (e.g. INFO or DEBUG), you should set the logging level in caplog to a lower value before the function call.

It's important to note, that such tests as the example above, you are asserting that the messages are present somewhere in the log, regardless of their position. This is done by checking that the expected message is in the list of log messages, which will return True if the expected message is found anywhere in the list.

If you want to assert on the order of the log messages, then you would need to check the messages based on their index in the log_messages list. For example, if you want to check that the first logged message is "This is a warning message", you could do:

```python
assert log_messages[0] == "This is a warning message"
```

This will only pass if "This is a warning message" is the first message in the log. However, remember that relying on the order of log messages can make your test more brittle, as changes to the order of logging in the code would cause the test to fail. In general, it's better to check that the expected messages are present somewhere in the log, unless the order is particularly important.

That's about it, easy, right?
By using pytest's caplog fixture, you can create robust tests that not only verify your application's behavior, but also confirm it's producing the right log messages. This can be invaluable when diagnosing issues in production, as it ensures your logging is accurate.
