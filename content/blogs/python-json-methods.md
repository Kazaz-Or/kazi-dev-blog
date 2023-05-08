---
title: "Exploring JSON in Python: load/loads and dump/dumps"
description: "Dive into the differences between Python's json module methods: json.load/json.loads & json.dump/json.dumps"
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/code-7198654_960_720.jpg
date: "2023-05-08"
tags: ["Python"]
---

When working with JSON in Python, you'll likely come across the built-in json module, which provides easy-to-use methods for encoding and decoding JSON data. 

In this blog post, we'll discuss the differences between json.load/json.loads and json.dump/json.dumps methods, and provide examples of how to use each method.

Why? It's indeed quite basic, but it can be a bit confusing when getting started with Python and while using the json module.

### json.load and json.loads

`json.load` and `json.loads` are used to decode JSON data. While both methods serve the same purpose, they differ in the type of input they accept:

* json.load: Decodes a JSON object from a file-like object (e.g., a file or a StringIO object).
* json.loads: Decodes a JSON object from a string.

Let's look at examples for each method:

```python
import json

with open("example.json", "r") as file:
    data = json.load(file)

print(data)
```
Here, example.json is a file containing a JSON object, and `json.load` is used to read and decode the JSON data into a Python object (e.g., dictionary or list).

```python
import json

json_string = '{"name": "Alice", "age": 30, "city": "New York"}'
data = json.loads(json_string)

print(data)
```
In this example, `json.loads` is used to decode a JSON-formatted string into a Python dictionary.

### json.dump and json.dumps

`json.dump` and `json.dumps` are used to encode Python objects into JSON format. Similar to `json.load` and `json.loads`, these methods differ in the type of output they produce:

* json.dump: Encodes a Python object and writes it to a file-like object.
* json.dumps: Encodes a Python object and returns a JSON-formatted string.

Examples for each method:

```python
import json

data = {"name": "Alice", "age": 30, "city": "New York"}

with open("output.json", "w") as file:
    json.dump(data, file)
```

In this example, `json.dump` is used to write the JSON representation of a Python dictionary to a file named output.json.

```python
import json

data = {"name": "Alice", "age": 30, "city": "New York"}

json_string = json.dumps(data)
print(json_string)
```
Here, `json.dumps` is used to convert a Python dictionary into a JSON-formatted string.

Now that we've covered the basic usage of `json.load`, `json.loads`, `json.dump`, and `json.dumps`, let's take a look at a "real-world production" example using these methods. In this example, we'll read JSON data from a RESTful API, modify the data, and save it to a file.

Imagine you're working with a weather API that returns a JSON object containing weather data for a given location. Here's how you might use `requests` library to get the data, `json.loads` to parse it, and `json.dump` to save it:

```python
import json
import requests

# Fetch weather data from a RESTful API
url = "https://api.example.com/weather?location=New%20York"
response = requests.get(url)

# Parse JSON data using json.loads
weather_data = json.loads(response.text)

# Modify the data (e.g., convert temperature to Celsius)
weather_data['temperature'] = (weather_data['temperature'] - 32) * 5/9

# Save modified data to a file using json.dump
with open("weather_data.json", "w") as file:
    json.dump(weather_data, file)
```

In this example, we first fetch weather data from a RESTful API using the `requests` library. The API returns a JSON-formatted string, which we parse into a Python dictionary using `json.loads`. Next, we modify the temperature value by converting it from Fahrenheit to Celsius. Finally, we save the modified weather data to a file named weather_data.json using `json.dump`.

This example demonstrates how you might use json.load, json.loads, json.dump, and json.dumps in a production environment when working with JSON data from various sources, such as APIs, files, or strings.
