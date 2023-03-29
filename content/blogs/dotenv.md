---
title: "Using Secrets or Private Environment Variables? .env is the Answer"
description: How can we hide API keys, secrets and passwords in our code, especially if pushing our code to an external repository? How can we run an application locally using these env vars?
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1540&q=50
date: "2023-03-25"
tags: ["NodeJS", "General"]
---

How can we hide API keys, secrets and passwords in our code, especially if pushing our code to an external repository? How can we run an application locally using these env vars?

Preventing exposure of sensitive information in our code is essential and necessary - We don't want external parties to have unauthorized access to our databases, passwords, and services we use. Therefore, we want to secure this information as best as possible.

So how exactly do we do that?

The solution I used is quite simple - Wwe need to create a local file in the project root directory that will store and centralize all the API keys and sensitive information we want to secure. 

Additionally, we will ensure that this file is added to the gitignore file, of course, as it is intended to be stored only in the local environment.

This file called .env, which is short for environment variables. Its purpose is to manage and allow runtime access to variables containing sensitive information, without using hardcoding in the text for these values.

The file will contain only variables in a key-value pair format.

For example, in Node.js, to access the values ​​instead of writing in our code like this - const API_KEY = "123", we will write like this - const API_KEY = process.env.API_KEY (using the global Node object -> process).

Not only does the env file improve the modularity and maintenance of the code, but it also allows flexibility and separation between the values ​​of each key in different environments - for example, for the development stage, we will provide a separate env file with different passwords than in the testing or production stages.

In Node.js project I use the **dotenv** package to make life easier.

The dotenv package is a popular tool that simplifies the process of swapping various env file parameters in the system according to the work environment.

You can install it with npm (saved under dev dependencies)

```js
npm install dotenv --save-dev
```

And just for the sake of the example, here's how I run my unit tests using dotenv & Mocha.
From the package.json:
```js
"test": "mocha --inline-diffs tests/unit-tests/ -r dotenv/config"
```

In conclusion, you should definitely consider using env files to secure your  code, especially in personal projects and during the development stage. 
