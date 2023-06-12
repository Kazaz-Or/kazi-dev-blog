---
title: "Crafting Meaningful Custom Exceptions in Python: Best Practices and Common Techniques"
description: Boost your Python code clarity and debuggability with custom exceptions. Explore best practices for crafting and handling them effectively
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/pce.jpg
date: "2023-06-12"
tags: ["Python"]
---

I recently encountered an intriguing issue at my workplace, which inspired me to pen down this blog post. I was utilizing a Python package built by a team different from mine. This particular scenario arose when I was employing this package in one of my functions, and in order to catch any exceptions raised by the package, I wrote a try-except block. To augment the code readability, I inserted a logging statement within this block, as illustrated below:

```python
try:
    # do something
    log.info(f"Looking for faulty devices, found: {len(faulty_devices)} devices")
    for device in faulty_devices:
        log.info(f"Device: {device['deviceId']} has faulty status: {device['status']}, sending a message to MQ")
        await messages.send_message_to_queue(message=device) #one of the internal package methods
except Exception as err:
    log.error(f"An error occurred while getting data from devices or while sending message to MQ: {err}")
```

However, upon testing an edge case that would steer the flow of control into the except block, the resultant log message was surprising to me from the expected error details.
The log just printed something like: 

`An error occurred while getting data from devices or while sending message to MQ:` The exception was missing from the log message.

Looking at the source code of the package, you could see the issue immediately (below code is merely a representative example and not the actual code):

```python
from http import HTTPStatus


class APError(Exception):
    """ Base class for all AP errors """
    CODE: int
    DESCRIPTION: str
    REASON: int

    def __init__(self, *args, **kwargs):
        self.extra = kwargs
        super().__init__(*args)

    def __repr__(self) -> str:
        params = [repr(arg) for arg in self.args]
        for key, value in self.extra.items():
            params.append(f'{key}={repr(value)}')
        return f'{self.__class__.__name__}({", ".join(params)})'


class GeneralSQSError(APError):
    """ General error related to SQS """

    CODE = HTTPStatus.BAD_REQUEST
    DESCRIPTION = 'Error returned from SQS service'


class SQSQueueDoesNotExistError(APError):
    """ The SQS queue requested does not exist """

    CODE = HTTPStatus.NOT_FOUND
    DESCRIPTION = 'Queue does not exist'
```

So why it's related the log output?

When an exception is raised, you can directly print the exception `err` to get its string representation. By default, this calls the `__str__` method of the exception object. If this method is not overridden in the exception class, Python uses the `__str__` method of the base Exception class, which by default returns the arguments passed to the exception when it was raised.

In this case of custom exceptions, we have overridden the `__repr__` method but not the `__str__` method.
`__repr__` is used to provide a "string representation" of the object for debugging purposes and is not the same as `__str__`. While `__repr__` is used when you call repr(object), `__str__` is used when you call str(object) or when you use the object in a string context (like f-string in our example).

If you want your exceptions to provide a useful message when used in a string context, you should override the `__str__` method. 

So here are a few common practices for creating custom exceptions in Python:

## Inheritance from Python's built-in exceptions

Whenever you create a custom exception, you should make it inherit from Python's built-in exceptions. The most common practice is to inherit from the Exception class or from a more specific exception class if it fits your case.

```python
class CustomError(Exception):
    """Base class for other exceptions"""
    pass
```

## Use meaningful names 

Like all Python identifiers, exception names should be as descriptive as possible.

## Add useful error messages 

The constructor of your custom exception should be defined to accept a custom error message as a parameter. This message can then be passed to the base class constructor using the `super()` function. This way, you can provide more specific details about what went wrong.

```python
class CustomError(Exception):
    """Base class for other exceptions"""
    def __init__(self, message="A custom exception occurred"):
        self.message = message
        super().__init__(self.message)
```

## Add additional context 

Sometimes, an error message alone is not enough. If there are important variables or state information that would help diagnose the problem, consider adding these to your exception.

```python
class CustomError(Exception):
    """Base class for other exceptions"""
    def __init__(self, message="A custom exception occurred", context=None):
        self.message = message
        self.context = context
        super().__init__(self.message)
```

## Document your exceptions

If other developers (or future you) are going to use your code, you should document your exceptions.
What conditions cause them to be raised? What do they signify?

Here's a full example of a custom exception in Python:

```python
class InsufficientBalanceError(Exception):
    """Raised when the balance is insufficient for a transaction"""
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        message = f"Your balance of {balance} is insufficient for a transaction of {amount}."
        super().__init__(message)
```

You can use it like this:
  
```python
def withdraw(balance, amount):
    if balance < amount:
        raise InsufficientBalanceError(balance, amount)
    return balance - amount
try:
    withdraw(50, 100)
except InsufficientBalanceError as e:
    print(str(e)) # Your balance of 50 is insufficient for a transaction of 100.
```

## Define special builtin methods

Defining special methods like `__str__` for your exceptions can be very useful in some cases.

```python
class InsufficientBalanceError(Exception):
    """Raised when the balance is insufficient for a transaction"""
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount

    def __str__(self):
        return f"Your balance of {self.balance} is insufficient for a transaction of {self.amount}."
```

Now, the `__str__` method is defined inside the InsufficientBalanceError class, so when you print the exception object, Python will print whatever the `__str__` method returns.

Remember that the `__str__` method should always return a string. It is called by built-in functions and operators that convert the object into a string, such as `print()` and `str()`.

There additional methods that are sometime being overridden in custom exceptions, like `__repr__` for example.

if you want to customize how your exceptions are displayed when using the `repr()` function, you'll need to define `__repr__` method as well in your exception class.

for example:

```python
class InsufficientBalanceError(Exception):
    """Raised when the balance is insufficient for a transaction"""
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount

    def __str__(self):
        return f"Your balance of {self.balance} is insufficient for a transaction of {self.amount}."

    def __repr__(self):
        return f"InsufficientBalanceError(balance={self.balance}, amount={self.amount})"
```

In this example, `__repr__` returns a string that shows how you would create the object, which is a common convention for __repr__.

To sum up,

When creating custom exceptions in Python, there are several common practices to consider. It's crucial to inherit from Python's built-in exceptions, usually from the Exception class. 
Naming your exceptions clearly and descriptively can make your code easier to understand. 
Moreover, it's a good idea to add useful error messages to your exceptions and pass any relevant context that could help diagnose the problem. 
Documenting what conditions cause your exceptions to be raised and what they signify is another beneficial practice.

Custom exceptions can be further enhanced with the implementation of Python's special methods. The `__str__` method, for example, can be used to provide a human-readable string representation of the exception, which is returned when calling `str()` or `print()` on the exception object. The `__repr__` method provides a string that could be used to recreate the object, typically used for debugging and development. This is invoked when calling `repr()` on the object.

By following these guidelines, you can make your custom exceptions more meaningful and informative, aiding in the debugging process and making your code easier to use and understand.
