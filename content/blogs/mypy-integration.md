---
title: Integration of MyPy into Python Our Services
description: I've assigned with a task to integrate MyPy into our Python services. Here's what I've learned so far (and still learning).
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://res.cloudinary.com/practicaldev/image/fetch/s---hNYwjmj--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w6d2pm4it1rwdvew7amx.png
date: "2023-09-4"
tags: ["Python"]
---

I'll start with a disclaimer - I'm fairly new to Python typing system while you actually need to enforce it, and I'm still learning. I'm writing this post to share my experience and what I've learned so far.

MyPy is a static type checker for Python. It combines the benefits of dynamic typing and static typing. As it is optional, you don't have to use this in your codebase, but once you decide to use it, it can significantly increase code readability and detect certain types of bugs before runtime.

So at first, I've started with a simple Python service, and I've added MyPy to it while mypy runs in a non-strict mode. I've added a few type hints and return values to the code, and it was pretty straightforward.
Then I went on and ran it in strict mode, which I think requires some explanation for those who are not familiar with it.

__Strict mode vs Non-strict mode__

MyPy's "strict mode" is an optional feature that enforces stricter type checking rules in your code. This is intended to catch more potential bugs and make your code more robust, at the cost of needing to be more explicit about your types.

In non-strict (or normal) mode, MyPy uses a certain set of rules to check your types. This is a balance between flexibility and safety. It's designed to catch the most obvious type errors while not requiring too much type annotation overhead.

When you enable strict mode, you're telling MyPy to use a more rigorous set of rules. These rules catch more potential issues but also require more complex type annotations.

Here are some of the things that change when you enable strict mode:

- All function parameters and return values must be explicitly typed. Without strict mode, MyPy allows functions without type annotations.

- Variables won't be implicitly typed as `Any`. Without strict mode, MyPy will often infer the type of a variable as Any if it can't determine its type.

- MyPy will check the body of every function, regardless of whether it has type annotations. Without strict mode, MyPy might skip the bodies of functions without type annotations.

- Optional types must be explicit. In normal mode, MyPy will infer an implicit Optional for arguments with a default value of None. Strict mode requires Optional to be explicit.

And I assume they are way more to discover.

Strict mode is enabled by adding `--strict` to the command line when running MyPy, or by adding `strict = True` to the MyPy configuration file. It's often a good idea to enable strict mode if you're starting a new project, as it encourages good type annotation habits from the beginning. However, for existing projects, turning on strict mode could lead to a large number of errors that need to be fixed.
Whether or not to use strict mode in such cases can be a team decision based on the specific requirements of the project and the team's capacity to handle the additional type annotation work.

In general, strict mode can be a very powerful tool to ensure type safety and can lead to higher quality, more maintainable code. However, it comes with an overhead in terms of the additional type annotations required, so it's a trade-off that each project team needs to evaluate for themselves.

__On to the PoC__

So I started with a PoC on one of our small Python services (~30 src files).

At first, mypy was installed as a dev dependency and ran in a non strict mode. After a batch of fixes I enabled strict mode which had quite significant amount of errors that discovered two potential bugs, and noted that in the code I was using a pattern which is considered as a risky one (Liskov Substitution Principle (LSP)). In simple terms, states that if a program is using a base class, it should be able to use any of its subclasses without the program knowing it.

After a day of fixes, mypy ran perfectly on my local dev machine.

I've implemented both pre-commit hooks (for staged changes) and CI workflow (for all src files) to run mypy on the codebase. Configuration file (mypy.ini) was added to the root of the project, and it's being used by both pre-commit and CI workflow.
In High level, the workflow runs mypy in strict mode but ignores import checks for 3rd party packages.

__Issues Encountered__

- I had a known type, but there’s a slight option that the type will be different. In such case you can use the built-in cast method from the typing module. It'll tell the static type checker that we're expecting a specific type even if it could be something else.

For example:
```python
from typing import cast

def check_if_attribute_exists(argument: str) -> str | None:
    # [...]
    device = SomeClass(argument).execute()
    if 'attribute' in device:
        return cast(str, device['attribute'])
    else:
        return None
```
`execute` method returns the following type - `dict[str, Any]` - meaning a dictionary with keys as string, while the value can be anything.
Then if there’s a attribute key in the dictionary, we fetch it’s value and treats it’s like a string, although it can be anything else per our return value defined for `execute` method.

In such case, mypy throws the following error:
`src/api/device.py:28: error: Returning Any from function declared to return "dict[str, Any]" [no-any-return]`

In the following case, we know that if attribute exists, it’ll be a string, therefore we can use the cast method and it’ll solve the mypy error.
Of course, in any case like this or similar to an error that you want to remove, you can use the following comment next to the problematic code line `# type: ignore`, although I'm not a fan of it.

- I couldn’t find a way the set a global exclusion of import checks across all 3rd packages. Current solution was to define it in the config file per package such as in this case for the `requests` library.

```ini
[mypy-requests]
ignore_missing_imports = True
```

- Custom Types - There are scenarios where you’d like to create your own custom type. Cases like where you have complicated nested type, or a case where you want to return something specific like in this example:

I have a method in a class that should return a response object from a 3rd party API response. There are cases where i’d like to get some of its attributes such as status_code, content, reason, etc. There are many options to define a custom type, but one of the easiest ways is to use a `TypeAlias` as suggested by mypy’s docs. [Kinds of types - mypy 1.5.1 documentation](https://mypy.readthedocs.io/en/stable/kinds_of_types.html)

I can save the response object in a variable wrapped in TypeAlias and use it as a return value of a method.

```python
import requests

from typing import TypeAlias

Response: TypeAlias = requests.models.Response

def execute(self) -> Response:
    response_json = self._execute(self._base_url + self._path() + self. _query_params())
    return response_json
```

- What type should I've used for *args and **kwargs - If you don’t know what type you should expect, it is common practice to use the `Any` type? This is what I did in my case, but I know it's not considered as best practice (Will get to it later).

- Environment variables default values - Due to the fact the that env vars can be something and can be `None` (if not passing anything), mypy raises an error saying that for example env var called `SERVER_PORT` can be int or None, and when using this env var to start the server, mypy complains you’ll have an issue in case the port is None obviously. This can be solved in two practices; set default value (which is more common practice per mypy’s docs), or when using the env var, wrap it with cast.

For example, let’s say I have a server using this `SERVER_PORT` env var for startup

```python
import uvicorn

uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('SERVER_PORT', '8080'))) 
```

Server runs without passing anything to this env var, due to default port.

By the way, my team members are against default values in case like this as it can hide issues from us, so instead of assigning a default port, I used a clear string as default so the problem (if there is one) will be right there in our faces.

```python
import uvicorn

uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('SERVER_PORT', 'MissingPort'))) 
```

The error message will be very clear what went wrong:

`Error: 'MissingPort' is not a valid port number.`

- Remember the `Any` type question? well, I got to know Generics after some research. I Should have used Generics in many cases which can provide us much better solution for type Annotating even unknown types. Awesome and detailed explanation can be found here - [Python Typing Generics and Python 3.11 Variadic Generics](https://www.youtube.com/watch?v=7Chd5gPHlDg&ab_channel=AnthonyShaw). Seriously, it's one of the best detailed explanation I've seen so far.


__Common Issues__

- Missing Stub Packages:

If you see errors about missing library stubs for a package like `requests` for example, you can use the `--install-types` command line option with MyPy to automatically install the missing type stubs packages. But using it in CI is a bit hacky in my point of view, because it requires a user input. To workaround it you can run the command like this: 

```bash
yes | mypy --install-types. 
```

Honestly, this doesn’t seem as a ideal solution to me, because not all packages has `py.typed` defined in their `pyproject.toml`. I preferred using the ignore imports flags instead due to this.

- Virtual Environment Issues:

MyPy type checking might behave differently inside and outside of a Python virtual environment. If you're encountering errors when running outside a virtual environment, try running MyPy inside the virtual environment where the package dependencies are installed.

- Dealing with Dynamic Attributes:

When dealing with classes that have dynamic attributes (like classes using `__getattr__` or `__setattr__`), you might encounter errors about attributes not being defined. This is because MyPy can't know about these attributes at the static type checking phase. You might need to add type annotations or comments to help MyPy understand these.

That's about it. Would love to get some feedback and hear about your experience with MyPy as I'm just starting to learn how to work with type annotations in Python.