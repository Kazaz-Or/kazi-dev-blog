---
title: FastAPI Background Tasks - Introduction Guide
description: FastAPI feature for lightweight background tasks (functions) that will run in parallel with your main application.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/fastapi-backgroundtasks.png
date: "2023-08-24"
tags: ["Python", "FastAPI", "Backend"]
---

One of the many features of FastAPI is support for background tasks. I first encountered this feature when I was working on a project at work that required processing large datasets triggered from an API endpoint.

In This article I'll share what i've learned about FastAPI's background tasks, with some insights and examples, especially in the context of data manipulation using the popular Pandas library.

__So What are Background Tasks?__
In web development, many times, you'd come across operations that are time-consuming. These could be sending out emails, handling database migrations, or processing large datasets. Running such operations (even when using async operations) can block your API from responding to other requests, or worst - hang the response from an HTTP request, leading to a degraded user experience.
That's where background tasks come in play. They allow these time-consuming operations to run "in the background", ensuring that your API remains responsive.

FastAPI provides a simple way to execute functions in the background using the `BackgroundTasks` class. This lets you execute functions asynchronously while sending the response to the client.

Let's create an example wheres an endpoint in FastAPI receives some data, triggers a background task to process it with Pandas, and instantly sends a response back to the client.

Here's a simple FastAPI application:

```python
from fastapi import FastAPI, BackgroundTasks
import pandas as pd
import time

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "OK"}
```

Now let's add an endpoint that will receives a list, convert it to a Pandas DataFrame, process it in the background, and return a response to the client immediately:

```python
def process_data(data: list):
    df = pd.DataFrame(data)
    # Just for demonstration, we'll simulate some processing time
    time.sleep(5)
    print(df)

@app.post("/process/")
def process_endpoint(data: list, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_data, data)
    return {"message": "Data is being processed"}
```

In this example, when you send a POST request with a list of data to the "/process/" endpoint, FastAPI will trigger the `process_data` function as a background task and immediately respond with `{"message": "Data is being processed"}` to the client while the task is being processed in the background.

Things to take into account (learned the hard way), we can basically say background tasks are silent workers, meaning that if they fail, you might not know. Thus, error handling is crucial:

```python
def process_data(data: list):
    try:
        df = pd.DataFrame(data)
        time.sleep(5)
        print(df)
    except Exception as e:
        print(f"Error occurred: {e}")
```

Another thing to take into account is that background tasks are not guaranteed to run. If your application crashes or restarts, the background tasks will be lost. If you need to ensure that a task is executed, you should consider using something like a message queue or an async task handler like Celery, which is considered as a better practice than these lightweight background tasks.
