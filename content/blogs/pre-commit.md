---
title: Leverage Pre-Commit Hooks to Improve Your Git Workflow
description: By customizing your git log output, you can make your Git logs look exactly the way you want which could make your life easier.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/pre-commit.png
date: "2023-09-29"
tags: ["General", "git"]
---

I came across pre-commit hooks a while ago and I was amazed by how easy it is to use and how much it can improve your git workflow. I got to see how useful it can be especially when working on large project or when lots of developers are working on a repository.

The good thing about pre-commit, is that it’s quite straightforward to setup. To showcase how easy it is, I’ll use mypy as an example, as this is a real pre-commit hook I had to setup on one of our repositories.

Just a refresher - mypy is a static type checker for Python. It is used to find bugs mostly related to types in your code without actually running it. For more information about mypy you can checkout my previous blog post about it - [mypy](/blogs/mypy-integration)

To set up a pre-commit hook that will run mypy before allowing a commit, you can use the pre-commit library, which is a tool (or a framework actually) for managing and maintaining multi-language pre-commit hooks. Of course, you can use it for every check you like such as linting, testing, etc.

Here are the steps to set it up:

1. Install the pre-commit framework. If you haven't already installed it, you can do so with pip/poetry:
```bash
pip install pre-commit # pip
```
```bash
poetry add pre-commit@latest --group dev # poetry
```

2. Create a `.pre-commit-config.yaml` file. This file is used to configure what actions pre-commit will take. The .pre-commit-config.yaml file is typically placed at the root of your repository as pre-commit tool will look for this file in the root directory by default when it runs.

Here's an example of what it might look like for running mypy:

```yaml
repos:
-   repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.4.1
    hooks:
    -   id: mypy
        args: ["--config", "mypy.ini"]
        files: ^src/
```

This configuration tells pre-commit to use the mypy pre-commit hook from the mirrors-mypy repository.
The rev field should be set to the version of mypy you want to use, while the args are the CLI arguments you want to it to run with, in the case as exampled above, i’m just passing mypy’s config file that already includes all the desired flags.

3. Install the git hook scripts. You only need to do this once after cloning the repository.
You can do this by running the following command in your git repository:

```bash
pre-commit install
```

This will install a pre-commit script in your ``.git/hooks/`` directory that will automatically run your configured hooks when you run git commit.

4. Test the pre-commit hook. You can test the hook by trying to make a commit. If mypy finds any type errors, the commit will be blocked.


Couple of additional notes:

- Keep in mind, by default, pre-commit runs only on files that are staged for commit, but you can configure it to run on all the project’s file if you’d like just by telling it to check all .py files for example.

- Once someone clones the repository, in order to contribute, running the install command of pre-commit is a must. I'm aware there are some methods available to do this automatically, but i haven't seen one that I like.

- Uploading the ``.git/hooks`` directory into github is not recommended of course.

- If you wish to place your .pre-commit-config.yaml file elsewhere which is not the root directory, such as in a .github/pre-commit/ directory, you can do so by specifying the `PRE_COMMIT_CONFIG_FILE` environment variable to point to its location.
For instance, if your .pre-commit-config.yaml is in .github/pre-commit/, you can set PRE_COMMIT_CONFIG_FILE as follows:
``export PRE_COMMIT_CONFIG_FILE=.github/pre-commit/.pre-commit-config.yaml``

Keep in mind that anyone cloning your repository will also need to set this environment variable, or pre-commit will not be able to find the configuration file. Due to this potential complication, it is usually easier to keep the .pre-commit-config.yaml at the root of your repository.
