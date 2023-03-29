---
title: "You Should Really Use Map When Possible"
description: The advantages of using Map in JavaScript over other Data Types
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/mapjs.webp
date: "2023-03-29"
tags: ["JavaScript", "NodeJS"]
---

In the realm of JavaScript, developers have a many different sets of data structures at their disposal. One such data structure, is the Map object, which offers significant advantages over other commonly used data structures, such as Arrays and Objects. In this article, I will share the benefits I discovered while using Map in JavaScript and provide comparisons to other data types like arrays and objects.

P.S:
I'm far from an expert so if you're interested in an article that cover this subject much more thoroughly, I recommend this amazing builder.io blog post - [Use Maps More and Objects Less](https://www.builder.io/blog/maps).

So let's begin.

***Key-Value Pairs and Unique Keys***
One of the most significant advantages of using Map is its ability to store key-value pairs. Unlike arrays, which only use numeric indices (indexes), Map objects allows to use any data type as a key, including objects and functions. Additionally, Map ensures that each key is unique, simplifying data organization and retrieval.

**Arrays:** Numeric indices only, leading to limitations in organizing data.

**Objects:** Can use any data type as keys but do not guarantee unique keys.

**Maps:** Any data type as keys, offering flexibility and unique keys for better organization.

```javascript
// Arrays
const array = ['value1', 'value2', 'value3'];
// Access element using numeric index
console.log(array[0]); // Output: 'value1'

// Objects
const object = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
};
// Access element using any data type as key (but not guaranteed unique)
console.log(object['key1']); // Output: 'value1'
object['key1'] = 'newValue1';
console.log(object['key1']); // Output: 'newValue1'

// Maps
const map = new Map();
const objKey = { id: 1 };
const funcKey = function() { return 'hello'; };
map.set(objKey, 'value1');
map.set(funcKey, 'value2');
map.set('key3', 'value3');

// Access element using any data type as key (unique keys)
console.log(map.get(objKey)); // Output: 'value1'
console.log(map.get(funcKey)); // Output: 'value2'
```

***Iteration and Order Preservation***
Another notable advantage of using Map is its built-in iteration capability, which preserves the insertion order of elements. This feature is particularly useful when developers need to maintain the order of elements while performing operations or iterating over the data.

**Arrays:** Preserves order, but lacks built-in iteration methods for key-value pairs.

**Objects:** Order not guaranteed, and lacks built-in iteration methods for key-value pairs.

**Maps:** Preserves order and provides built-in iteration methods for key-value pairs.

```javascript
// Arrays
const array = ['value1', 'value2', 'value3'];
array.forEach((value, index) => {
  console.log(index, value);
});

// Objects
const object = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
};
for (const key in object) {
  if (object.hasOwnProperty(key)) {
    console.log(key, object[key]);
  }
}

// Maps
const map = new Map();
map.set('key1', 'value1');
map.set('key2', 'value2');
map.set('key3', 'value3');
map.forEach((value, key) => {
  console.log(key, value);
});
```

***Efficient Additions and Deletions***
When comparing arrays, objects, and maps, it is important to consider the differences in how they handle additions and deletions. Maps are specifically designed for efficient manipulation of key-value pairs, making them more suitable for situations where frequent updates are required.

**Arrays:** When adding or deleting elements in arrays, the length of the array needs to be adjusted. Deleting an element from an array using `splice()` leaves no gaps, but it requires re-indexing the remaining elements, leading to performance issues in large data sets. Additionally, the length property of an array will update accordingly when elements are added or removed.

Keep in mind that if your'e using the `delete` keyword (common root cause for bugs) - it removes the element, but the length of the array remains the same. The deleted element's position will be `undefined`.

**Objects:** Deleting properties from objects does not require re-indexing or updating the length, but it can be slower with large objects. Objects also do not have a built-in property for tracking the number of properties, making it harder to manage the size of the object.

**Maps:** Maps are designed for efficient addition and deletion of key-value pairs. They have a built-in size property for tracking the number of elements, making it easier to manage the size of the Map. The performance of maps is optimized for frequent additions and deletions, providing better performance in scenarios that require frequent updates.

```javascript
// Arrays
const array = ['value1', 'value2', 'value3'];

// Adding an element
array.push('value4');

// Deleting an element
const indexToDelete = 1;
array.splice(indexToDelete, 1);

// Deleting an element using the delete keyword
delete array[1]; // Removes the element at index 1

console.log(array); // Output: ["value1", undefined, "value3"]
console.log(array.length); // Output: 3

// Objects
const object = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
};

// Adding a property
object.key4 = 'value4';

// Deleting a property
delete object.key2;

// Maps
const map = new Map();
map.set('key1', 'value1');
map.set('key2', 'value2');
map.set('key3', 'value3');

// Adding a key-value pair
map.set('key4', 'value4');

// Deleting a key-value pair
map.delete('key2');
```

***Enhanced Performance***
When it comes to performance, Map outshines both arrays and objects in specific use cases, such as frequent additions and deletions of key-value pairs. Maps are optimized for these operations, providing faster performance than arrays and objects under such circumstances.

**Arrays:** Slower performance when adding or deleting elements, especially in large data sets.

**Objects:** Slower performance when adding or deleting properties, particularly with large objects.

**Maps:** Optimized for faster performance during frequent additions and deletions.

As for the examples - Using `console.time()` and `console.timeEnd()` to measure the time taken for performing the same set of actions on Arrays, Objects, and Maps may not show significant differences in small examples. However, I'll provide an example with these methods for a general idea. Note that the difference in performance will be more evident with larger data sets or more complex operations.

```javascript
// Arrays
const array = ['value1', 'value2', 'value3'];
console.time('ArrayOperations');
array.push('value4');
array.splice(1, 1);
console.timeEnd('ArrayOperations'); // Output: ArrayOperations: 808.588ms

// Objects
const object = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
};
console.time('ObjectOperations');
object.key4 = 'value4';
delete object.key2;
console.timeEnd('ObjectOperations'); // Output: ObjectOperations: 799.399ms

// Maps
const map = new Map();
map.set('key1', 'value1');
map.set('key2', 'value2');
map.set('key3', 'value3');
console.time('MapOperations');
map.set('key4', 'value4');
map.delete('key2');
console.timeEnd('MapOperations'); // Output: MapOperations: 608.085ms
```

***Efficient Size Retrieval***
When working with different data structures, it's important to know how easily and efficiently you can retrieve their sizes. Maps offer a simple and efficient way to do this compared to arrays and objects.

**Arrays:** Arrays have a built-in length property that provides the count of elements. While this is convenient, it doesn't offer the key-value pair structure that some use cases may require.

**Objects:** Objects do not have a built-in property to count their elements. To retrieve the count, you must loop through properties or use methods like Object.keys() or Object.getOwnPropertyNames(), which can be cumbersome and less efficient.

**Maps:** Maps provide a built-in size property, making it easy and efficient to determine the number of key-value pairs in the Map. This offers an advantage in use cases that require quick access to the element count.

```javascript
// Arrays
const array = ['value1', 'value2', 'value3'];
console.log(array.length); // Output: 3

//Objects
const object = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
};
console.log(Object.keys(object).length); // Output: 3

//Maps
const map = new Map();
map.set('key1', 'value1');
map.set('key2', 'value2');
map.set('key3', 'value3');
console.log(map.size); // Output: 3
```

There are many more advantages which i won't get into such as memory management and etc.

In conclusion, Map objects provide several advantages over arrays and objects in JavaScript. 
They offer flexibility with key-value pairs, preserve order during iteration, optimize performance for frequent additions and deletions, simplify element counting, and support garbage collection using WeakMaps. By understanding the differences and benefits of each data structure, developers can make informed decisions when choosing the best option for their specific use cases. Maps are a powerful addition to the JavaScript toolkit, offering enhanced functionality and performance in various scenarios where arrays and objects may fall short.
