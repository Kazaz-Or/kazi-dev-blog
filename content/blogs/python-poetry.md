---
title: "Python Packaging & Dependency Management with Poetry"
description: "Poetry: Simplify Python dependency management with an intuitive CLI, virtual environments, and seamless packaging & publishing"
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/poetry-p.jpeg
date: "2023-05-13"
tags: ["Python"]
---

This all started when I got a task at work to do a research about a the best way to move on from the deprecated method fo python packaging (setup.py, manifest.ini, etc) to the new and standard way using `pyproject.toml`.
From this simple task - I was able to convince my team to move on also from pip-tools and move on to [Poetry](https://python-poetry.org/).


## So What is Poetry?

In short, Poetry is a relatively new dependency management and packaging tool for Python.
It aims to simplify and streamline the process of managing dependencies, packaging, and publishing Python projects.
Poetry focuses on simplicity, ease of use, and reproducibility of environments.

Here's some of its capabilities:

* Poetry uses a `pyproject.toml` file to manage project metadata and dependencies, following the [PEP 517](https://peps.python.org/pep-0517/)/[PEP 518](https://peps.python.org/pep-0518/) standards.

* It provides features like dependency resolution, virtual environments, lock files, build systems, and publishing capabilities.

* It supports direct installation of dependencies from various sources like PyPI, Git, HTTPS, and local files.

* Poetry integrates well with the packaging and distribution tools like twine.

* Poetry generates a lock file for dependencies (poetry.lock).

* Supports extra-index-url similar to pip (secondary artifactory source for python packages).

* Supports dependency installation per “groups” such as dev-dependencies.

## Why Poetry Then?

Poetry provides a streamlined and user-friendly experience for managing dependencies, packaging, and publishing Python projects.
Poetry makes it straightforward to define and manage dependencies using the pyproject.toml file, which is the standard method to handle python packages at the moment. 
It handles dependency resolution efficiently, ensuring that you have reproducible environments for both development and deployment. 
Poetry also offers seamless integration with popular packaging and distribution tools like twine, making it convenient to publish your projects to PyPI or other repositories.

Additionally, Poetry's virtual environments and lock file mechanism help ensure that your project dependencies are isolated, consistent, and reproducible across different environments. The lock file, poetry.lock, guarantees that everyone working on the project will have the same versions of the dependencies installed, avoiding version conflicts (very similar to package-lock.json in JS). 

With its comprehensive set of features, extensive documentation, and an active community, Poetry provides a robust and user-friendly solution for managing Python dependencies, making it an excellent choice for modern Python development projects.

So let's move to some usage example (that can be also be found easily it the great Poetry documentation btw).

To start a new python package/project - 

```bash
poetry new <project-name>
```

This will generate some basic files and directories for your project:
```bash
poetry-demo
├── pyproject.toml
├── README.md
├── poetry_demo
│   └── __init__.py
└── tests
    └── __init__.py
```

The `pyproject.toml` file is what is the most important here. This will orchestrate your project and its dependencies. For now, it looks like this (example from one of my repos):

```toml
[tool.poetry]
name = "poetry-demo"
version = "0.1.0"
description = ""
authors = ["Sébastien Eustace <sebastien@eustace.io>"]
readme = "README.md"
packages = [{include = "poetry_demo"}]

[tool.poetry.dependencies]
python = "^3.11"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

Poetry assumes your package contains a package with the same name as tool.poetry.name located in the root of your project. If this is not the case, populate tool.poetry.packages to specify your packages and their locations.

Similarly, the traditional MANIFEST.in file is replaced by the tool.poetry.readme, tool.poetry.include, and tool.poetry.exclude sections. tool.poetry.exclude is additionally implicitly populated by your .gitignore. 

Poetry will require you to explicitly specify what versions of Python you intend to support, and its universal locking will guarantee that your project is installable (and all dependencies claim support for) all supported Python versions.

To initialize an already existing project -
```bash
poetry init
```

To add a new dependency - 
```bash
poetry add requests
```
Or with options just like with pip - 
```bash
poetry add "fastapi[all]"
```
this for example will add these libraries to the pyproject.toml

```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = {extras = ["all"], version = "^0.95.1"}
requests = "^2.30.0"
```

To remove a dependency - 
```bash
poetry remove pytest-asyncio
```

Add a new dependency to “dev dependencies” - 
```bash
poetry add pytest --group dev
```
This will add it under dev group deps - 
```toml
[tool.poetry.group.dev.dependencies]
pytest = "^7.3.1"
flake8 = "^6.0.0"
pytest-mock = "^3.10.0"
```

Add another source for internal packages - 
```bash
poetry source add --secondary <name> <url>
poetry config http-basic.<name> <username> <password/token>
```

Activate virtual environment - 
```bash
poetry shell
```
Install project’s dependencies - 
```bash
poetry install
```

And of course many other options you can find in [Poetry's documentation](https://python-poetry.org/docs/).