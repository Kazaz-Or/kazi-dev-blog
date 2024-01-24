---
title: "Why Makefile is One of My Essentials Tools in Every Software Project"
description: Makefiles are a cornerstone tool in the software development process, particularly useful for streamlining and automating the build process.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://res.cloudinary.com/practicaldev/image/fetch/s--tZ9sH2X4--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p5zybgxtx98ghhq8lp5m.png
date: "2024-01-24"
tags: ["General", "DevOps", "Python"]
---

Makefiles are powerful tools in a developer's arsenal, capable of significantly improving efficiency and consistency in the build process. By understanding and utilizing Makefiles for Docker and Terraform, developers can streamline their workflows, reduce repetitive tasks, and focus more on the creative aspects of software development.

In this article, we'll explore the basics of Makefiles and how they can be used to automate the build process with examples of Docker and Terraform commands usage.

### What is a Makefile?

Incorporating a Makefile into your project can greatly streamline various development tasks, such as managing dependencies, running tests, building documentation,formatting code, performing static analysis, build/compile/transpile, cleaning up temporary files and more.

The flexibility of Makefiles allows you to automate routine processes in a structured and efficient manner. Here's a more detailed look at how you can leverage Makefiles in your projects:


### Basic Structure of a Makefile

A Makefile typically consists of targets, prerequisites, and recipes. Targets represent the goals you want to achieve, which could be actions like running your app or installing dependencies. Prerequisites are files or other targets needed before a target can be executed. Recipes are shell commands that make will execute.

For instance, you might have a `run` target to execute your Python application, a `setup` target for installing dependencies listed in `requirements.txt`, and a `clean` target for removing Python bytecode files or the `__pycache__` directory.

### Advanced Techniques

__Default Goals and Help Messages:__ Setting a default goal, like `.DEFAULT_GOAL := help`, allows you to display a helpful message when make is run without a target.

__Virtual Environments:__ Integrating virtual environments in your Makefile ensures that the right Python environment and dependencies are used. This can be crucial in projects with specific version requirements or multiple dependencies.

__Injecting Paths into `PYTHONPATH:`__ This advanced trick allows Python to search for packages in specified file system paths without needing to install them, which can be particularly useful in projects with heavy dependencies or multiple branches.


### Some Practical Examples

__Running Tests with Coverage:__ You can create a coverage target to run tests with coverage, specifying the commands for running the tests and generating a coverage report.

__Linting and Static Analysis:__ A lint target can be set up to run various linting and static analysis tools like flake8, pylint, and mypy on your code.

__Task Dependencies and Parameters:__ Makefiles allow you to specify dependencies between tasks. For example, a test target might depend on a lint target. You can also pass parameters to tasks, like specifying an IP and port for a serve task.

__Makefile for Docker Commands:__ 

By leveraging Makefiles in your Python projects, you not only save time but also create a more robust and maintainable development environment. These examples and advanced features illustrate just how versatile and powerful Makefiles can be in automating and streamlining your Python development workflow.

```makefile
export TOP := $(shell git rev-parse --show-toplevel)
export IMAGE_NAME := my-docker-image
export CONTAINER_NAME := my-container-image

build:
	docker build --build-arg JFROG_USERNAME=${JFROG_USERNAME} --build-arg JFROG_ARTIFACTORY_TOKEN=${JFROG_ARTIFACTORY_TOKEN} -t $(IMAGE_NAME) .

run:
	$(TOP)/scripts/run_docker.sh &

exec:
	docker exec -it $(CONTAINER_NAME) /bin/sh

delete:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)
```
In this example the `build` command creates a Docker image with build arguments (`make build`).

The `run` command runs a script to start the container in the background (`make run`). It runs a bash script that starts the container in the background and saves the container ID in a file.

The `exec` provides an interactive shell within the container for debugging proposes (`make exec`).

The `delete` stops and removes the container (`make delete`).

__Makefile for Terraform Commands:__

Terraform, an infrastructure as code software tool, also benefits from Makefiles, its commands can become quite complex. Here's an example on why it is useful to use Makefiles for Terraform:

```makefile
account := dev
namespace ?= $(shell echo $(USER) | awk '{print tolower($0)}')
service ?= $(shell basename `git rev-parse --show-toplevel`)

ifeq ($(account), dev)
    AWS_PROFILE := 123456
else ifeq ($(account), stage)
    AWS_PROFILE := 654321
else
    $(error Invalid account specified: $(account))
endif

init:
	terraform init -reconfigure \
		-backend-config=config/$(account)/backend.tfvars -backend-config=key=services/$(namespace)/$(service).tfstate

plan:
	terraform plan -out /tmp/$(service).tfplan \
		-var-file=config/$(account)/terraform.tfvars -var-file=config/$(account)/service.tfvars \
		-var "namespace=$(namespace)" -var "service_name=$(service)"

apply:
	terraform apply /tmp/$(service).tfplan

validate:
	@terraform validate

destroy:
	terraform destroy \
		-var-file=config/$(account)/terraform.tfvars -var-file=config/$(account)/service.tfvars \
		-var "namespace=$(namespace)" -var "service_name=$(service)"
```

This Makefile automates various Terraform commands like `init` which initializes a new or existing Terraform configuration (`make init`).
This command is particularly used to initialize the working directory containing Terraform configuration files, with -reconfigure to force re-initialization. It specifies backend configuration variables and the state file location.

The `plan` command creates an execution plan. This command creates a Terraform plan and outputs it to a temporary file. It specifies variable files and sets additional variables like namespace and service_name (`make plan`).

The `apply` command applies the changes required to reach the desired state of the configuration (`make apply`).

The `validate` command is used to validate the syntax and configuration of the Terraform files (`make validate`).

The `destroy` command is used to destroy all resources managed by the current Terraform configuration (`make destroy`).

In conclusion, Makefiles stand as a fundamental and powerful tool in software development, offering a versatile approach to automating and streamlining various aspects of the build process. Whether you're working with Docker containers or managing infrastructure with Terraform, Makefiles bring a level of efficiency and consistency that can significantly enhance your workflow. By effectively leveraging Makefiles, developers not only save valuable time but also ensure a more robust and maintainable development process, making them an essential component in any modern software project.
