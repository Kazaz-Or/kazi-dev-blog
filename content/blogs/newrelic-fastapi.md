---
title: "Integrating NewRelic with FastAPI & Docker"
description: Enhance your FastAPI application's monitoring with NewRelic. Gain insights and improve performance with very minimal and simple setup steps. 
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/APM_summary_tiles.png
date: "2023-07-03"
tags: ["Python", "FastAPI", "DevOps"]
---

I'm not really sure why, but for some reason I couldn't find many references on troubleshooting and setup NewRelic with FastAPI. I'm not sure if it's because FastAPI is still fairly new, or maybe it's because it's so simple to setup that no one really bothered to write about it, so I thought there's no harm on doing so.

When I started this task at work, I couldn't believe how intuitive and easy it was to integrate the NewRelic agent and getting amazing set of metrics and insights on my application without much effort.
Monitoring applications is a critical part of any software development cycle, and NewRelic provides an amazing Application Performance Monitoring (APM) tool for this purpose. 

So here we're going to integrate NewRelic with FastAPI and Docker, allowing us to collect valuable data and monitor our applications more efficiently:

1. To start off, we need to install the NewRelic Python agent by running the following command:

```bash
pip install newrelic
```

2. Next, we need to import the NewRelic agent in our application file:

```python
import newrelic.agent
```

3. Set Up NewRelic Configuration;

There are two options here - Either download the `newrelic.ini` template file from NewRelic and fill in your valid New Relic license key.
You can find details about the configuration file [here](https://docs.newrelic.com/docs/apm/agents/python-agent/configuration/python-agent-configuration/#agent-configuration-file).

For Docker users, environment variables can be used as well, and this is actually my recommended way to do this. You just need to set `NEW_RELIC_APP_NAME` and `NEW_RELIC_LICENSE_KEY`.
Then pass in as an environment variable to your Docker container (either via Dockerfile or docker-compose.yml file).
On our case, we're fetching the license key from Vault using Terraform, which will be covered in a different blog post at some point.

4. Continue on and add an ENTRYPOINT for the NewRelic agent in your Dockerfile above the CMD command:

```dockerfile
ENTRYPOINT ["newrelic-admin", "run-program"]
```

If you're running the app without Docker, you can run your application with with additional command of newrelic agent, for example, here's how you can use it with gunicorn start command:

```bash
newrelic-admin run-program gunicorn app:app --config 'gunicorn.conf.py' --preload $*
```

5. To set up NewRelic, we initialize the agent and register our application:

I'd rather to wrap the two init agents commands with my own setup function, so I can pass in the application name as an argument:

```python
def setup_newrelic(app_name: str):
    newrelic.agent.initialize()
    newrelic.agent.register_application(name=app_name, timeout=10.0)
```

Then, we initialize the NewRelic agent in our gunicorn/Uuvicorn application:

```python
if __name__ == '__main__':
    setup_newrelic(app_name=f'{os.environ.get("NEW_RELIC_APP_NAME")}')
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('SERVER_PORT')))
```

By doing this, you will have enabled APM, which provides a wealth of useful metrics.

![APM-example](/images/apm.png)


6. Creating a Custom Event

Finally, to create a custom event in NewRelic, we can do the following:

```python
newrelic.agent.record_custom_event(event_name='ExampleEventName',
                value={'status_code': response.status_code},
                application=newrelic.agent.register_application())
```

The event_name must be a string, and value requires a dictionary with as many attributes as you wish to include.

Here's an example of a custom metric I created that helped me debug a large application where I wanted to get all exceptions types:

![custom-metric](/images/custom_metric_nr.png)


That's it! You now have NewRelic integrated with your FastAPI application running in a Docker environment. The possibilities for monitoring and analyzing your application are now significantly broader and more robust, helping you ensure that your application is always running at its best.
