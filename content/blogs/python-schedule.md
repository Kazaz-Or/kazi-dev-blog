---
title: "Schedule Your Python Methods with Schedule Library"
description: "Dive into the schedule library through practical examples & a real-life project scenario. Discover how to schedule your Python methods effectively"
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://cdn.stocksnap.io/img-thumbs/960w/coding-programming_PBTF1NEBCG.jpg
date: "2023-05-22"
tags: ["Python"]
---

During development of a monitoring project at work, I encountered a need to regularly sample APIs from a third-party tool we use, then reformat the responses to suit our requirements before sending the data to our monitoring infrastructure tools (VictoriaMetrics & Grafana). As the project progressed, it became apparent that I needed to schedule each function based on its specific scope and at varying intervals. The `schedule` library in Python offered a straightforward solution to this challenge.

Python's `schedule` library is an in-process job scheduler that uses the builder pattern for configuration. It allows you to run Python functions (or any other callable) periodically at pre-determined intervals using very a simple and a human-friendly syntax. 

This post aims to discuss the advantages and disadvantages of this library, provide practical examples, and share a real-world use case from a recent project.

I should state early on, that this is not a perfect solution for all type of "tasks" in Python. I believe that this covers quite well the more simpler tasks.
Moving on from the overview, let's take a look a little bit on the advantages and disadvantages found during the research of the development process of our project.

## Advantages

### Simplicity
One of the main benefits of the schedule library is its simplicity. It uses an easy-to-understand syntax that makes it accessible even to Python beginners. With a few lines of code, you can set up tasks to be run at any desired interval.

### Flexibility
With schedule, you can set up jobs to run at any interval using any Python function. This flexibility allows you to tailor how and when your jobs run to best suit your needs. Whether you want a function to run every five minutes, once a day, or every Monday at noon, schedule has you covered.

### In-process Scheduling
Another key advantage of schedule is that it enables you to manage all of your scheduled tasks within your Python process. This feature can simplify both your application architecture and deployment process, as there is no need for an external system to handle your tasks.

## Disadvantages

### Not Suitable for Large-scale/Distributed Systems
While schedule is a powerful tool for managing tasks in a single Python process, it does have limitations. For instance, it does not support features such as distributed scheduling or persistence of schedules across restarts. Consequently, it may not be the best fit for larger, distributed systems, or for situations where you need your schedules to persist across restarts.

### No Built-in Error Handling
The schedule library also lacks built-in error handling or job failure notifications. While it does allow error handling within jobs, it's up to the developer to ensure proper error handling is in place.

## Real-world Example: Our Monitoring Service
In a recent project, I used schedule to build a monitoring service that sends metrics to a time-series database. The service obtains most of its information from a third-party tool and, therefore, requires functions to run at scheduled intervals.

Here's how `schedule` was employed in the service:

```python
@repeat(every(config.DEVICE_STATUS_SAMPLING_INTERVAL).seconds)
def metric_data_devices():
    # function implementation...
```
In this function, `schedule` is used to run the function every X seconds, according to an environment variable comes from our deployment infrastructure code (Terraform).

Of course, there are many other built-in intervals at different formats interval (hours, minutes, days, etc.)

Here's an example from the [schedule library official docs](https://schedule.readthedocs.io/en/stable/), but I recommend exploring it further as I encountered many cool features that might be helpful for such task.

```python
import schedule
import time

def job():
    print("I'm working...")

schedule.every(10).minutes.do(job) # every 10 minutes
schedule.every().hour.do(job) # every hour
schedule.every().day.at("10:30").do(job) # once a day at a specific hour
schedule.every().monday.do(job) # every specific day in a week
schedule.every().wednesday.at("13:15").do(job) # every specific day in a week in a specific time
schedule.every().day.at("12:42", "Europe/Amsterdam").do(job) # every day in a specific time of a specific timezone

while True:
    schedule.run_pending()
    time.sleep(1)
```
