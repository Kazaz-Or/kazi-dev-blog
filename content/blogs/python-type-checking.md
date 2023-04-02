---
title: "Different Ways to Check a Variable is in Python"
description: Type checking is a thing you do a lot in Python as it can help prevent simple yet frustrating errors that may arise from incorrect variable types. In fact, it was one of the earliest and most lame bug I encountered in my programming journey
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1540&q=50
date: "2023-04-02"
tags: ["Python"]
---

Ok, I know it's kind of basic stuff right here, but this was one of the first bugs I event created and I felt I have to share it.

In Python, there are several ways to check whether a variable is a specific type. In my example i'll use the dictionary object. 

While these ways may seem interchangeable, they actually have some important differences that can affect your code's performance and maintainability. Let's take a closer look at each of these methods.

### Using `isinstance()`

The `isinstance()` function is a built-in Python function that takes two arguments: an object and a class (or tuple of classes). It returns True if the object is an instance of the specified class, and False otherwise. 

For example, to check whether a variable my_dict is a dictionary, you can use the following code:

```python
my_dict = {}

if isinstance(my_dict, dict):
    # do something with my_dict
```

One key difference between `isinstance()` and other methods is their behavior with subclassing. `isinstance()` returns True not only for instances of the specified class, but also for instances of any subclass of that class. 

For example, consider the following code:

```python
class MyDict(dict):
    pass

my_dict = MyDict()

print(isinstance(my_dict, dict))  # True
print(type(my_dict) is dict)      # False
```

Here, my_dict is an instance of a subclass of dict called MyDict. `isinstance()` returns True because MyDict is a subclass of dict, whereas `type()` returns False because MyDict is not the same as dict.


### Using `type()`

The `type()` function is also a built-in Python function that takes one argument: an object. 
It returns the type of the object as a Python class.

For example, to check whether a variable my_dict is a dictionary, you can use the following code:

```python
my_dict = {}

if type(my_dict) is dict:
    # do something with my_dict
```

Another important difference between these methods is their performance. In general, `isinstance()` is slower than `type()` because it has to check the object's class hierarchy to determine whether it is an instance of the specified class or subclass.
Therefore, if you know that an object is a dictionary and you just need to check its type, using `type()` may be faster.


### Using `is` dict

In Python, `is` dict is a keyword that checks whether an object is a dictionary object. It works similarly to the `type()` function, but it is more efficient because it does not have to look up the object's class hierarchy. If an object is a dictionary, `is` dict will return True, otherwise, it will return False.

For example, consider the following code:

```python
my_dict = {}

print(my_dict is dict)  # True
```

But there comes the old nostalgic bug I had and talked about before:

```python
my_dict = {'key1': 'value1', 'key2': 'value2'}

print(my_dict is dict)  # False
```

In this code, my_dict is an instance of the dict class, so my_dict is dict returns False.

When we use the `is` operator to compare my_dict with dict, Python checks if my_dict and dict refer to the same object in memory. However, my_dict and dict are not the same object in memory, even though they have the same type.

In other words, dict `is` a built-in Python class, while my_dict is an instance of that class. The `is` operator checks for identity, which means it checks whether two objects are the same object in memory. In this case, my_dict and dict are not the same object, so the expression my_dict is dict returns False.

### Conclusion

There are several ways to check whether a variable is a dictionary object in Python, including `isinstance()`, `type()`, and `is` dict. Each of these methods has some important differences that can affect your code's behavior and performance.

If you want to check whether an object is an instance of a certain class or any of its subclasses, you should use `isinstance()`. However, keep in mind that `isinstance()` may be slower than `type()` because it has to check the object's class hierarchy.

If you want to check whether an object is exactly of a certain type, use `type()`. This method is generally faster than `isinstance()` because it doesn't have to look up the object's class hierarchy.

If you just need to check whether an object is a dictionary, you can use `is` dict. This keyword is more efficient than using `type()` and can quickly determine the type of an object in your code. However, keep in mind that `is` dict checks specifically for dictionary objects, and not for subclasses of dict.


In summary, the best method to use depends on your specific use case. Choose the method that best fits your needs and keep in mind the differences between them. Don't create stupid bugs like I did :)
