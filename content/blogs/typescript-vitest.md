---
title: "I Wish I Knew Vitest When I Started My TypeScript Journey"
description: I have struggled so badly when it came to testing while using the notorious combination of Node, TypeScript & ES Module. And then I found Vitest
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/ts-vitest.jpeg
date: "2023-06-26"
tags: ["TypeScript", "Vitest", "Testing"]
---

I'll start with a confession - I'm fairly new to Typescript. Still learning how to work with it. I'm loving it so far, but, I have struggled so badly when it came to testing while using the notorious combination of Node, TypeScript & ES Module.
Maybe it's because i'm still learning TS, but I really appreciate tools which requires minimal to zero configuration. I know that's how it works with most tools in the JS/TS echo-system, but that's exactly what Vitest is.

So far, I could work my way with unit testing mostly using Jest, but it took me some time to make things up and running.

So to configure Jest correctly on my project, I had to add and install the following packages:

- jest
- ts-jest   
- @types/jest

Then I had to setup a `jest.config.js` file with the following content:

```js
import type { Config } from '@jest/types'

const baseDir = 'some/path'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
}

export default config;
```

If we are going with this minimal example, let's take some Utils class example:

```typescript
export class StringUtils {
    public toUpperCase(arg: string) {
        if (!arg) {
            throw new Error("Invalid Argument");
        }
        return toUpperCase(arg);
    }
}

export function toUpperCase(arg: string) {
    return arg.toUpperCase();
}

export type stringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
}

export function getStringInfo(arg: string): stringInfo {
    return {
        lowerCase: arg.toLowerCase(),
        upperCase: arg.toUpperCase(),
        characters: Array.from(arg),
        length: arg.length,
        extraInfo: {}
    }
}
```

This TypeScript code defines a class StringUtils with a method toUpperCase, which converts a string to uppercase, throwing an error for invalid arguments. The standalone function toUpperCase is also doing the same thing, converting the passed string to uppercase. The getStringInfo function takes a string as input and returns an object containing information about that string, such as its lowercase and uppercase forms, an array of its characters, its length, and an extra information object.

Let's take a look at some unit tests written with Jest:

```typescript
import { StringUtils, getStringInfo, toUpperCase } from "./Utils"


describe('utils test suite', () => {

    test.each([
        {input: 'test', expected: 'TEST'},
        {input: 'TEST', expected: 'TEST'},
        {input: 'test1$&*#()^41', expected: 'TEST1$&*#()^41'}
    ])('$input to UpperCase should return $expected', ({input, expected}) => {
        const result = toUpperCase(input);

        expect(result).toBe(expected);
    });

    test('should return info for valid string', () => {
        const result = getStringInfo('My-String');

        expect(result.extraInfo).toEqual({});
        expect(result.lowerCase).toBe('my-string');
        expect(result.length).toBe(9);

        expect(result.characters).toStrictEqual(["M", "y", "-", "S", "t", "r", "i", "n", "g"]);
        expect(result.characters).toHaveLength(9);
        expect(result.characters).toContain<string>('-');
    });

});


describe('StringUtils class', ()=> {
    let sut: StringUtils;

    beforeEach(()=>{
        sut = new StringUtils();
    });

    test('Sanity - valid string', () => {
        const result = sut.toUpperCase('abc');
        
        expect(result).toBe('ABC');
    });

    test('Should throw error on invalid argument (empty string) - function', () => {
        function expectError() {
            const result = sut.toUpperCase('');
        };
        
        expect(expectError).toThrow();
        expect(expectError).toThrowError('Invalid Argument');
    });

    test('Should throw error on invalid argument (empty string) - arrow function', () => {
        expect(() => {
            sut.toUpperCase('')
        }).toThrowError('Invalid Argument');
    });

    test('Should throw error on invalid argument (empty string) - try catch block (workaround)', (done) => {
        try {
            sut.toUpperCase('');
            done('GetStringInfo should throw error for invalid arg');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid Argument');
            done();
        }
    });

});
```

What if I want to switch to Vitest Now? Well, I'll have to install the following package:

- vitest

Yep, that's it.

A project using TS & ES Module will work out of the box with Vitest. No need to configure anything.

Let's take a look at the same tests written with Vitest:

```typescript
import { test, describe, expect, beforeEach } from 'vitest'

import { StringUtils, getStringInfo, toUpperCase } from "./Utils"


describe('utils test suite', () => {

    test.each([
        {input: 'test', expected: 'TEST'},
        {input: 'TEST', expected: 'TEST'},
        {input: 'test1$&*#()^41', expected: 'TEST1$&*#()^41'}
    ])('$input to UpperCase should return $expected', ({input, expected}) => {
        const result = toUpperCase(input);

        expect(result).toBe(expected);
    });

    test('should return info for valid string', () => {
        const result = getStringInfo('My-String');

        expect(result.extraInfo).toEqual({});
        expect(result.lowerCase).toBe('my-string');
        expect(result.length).toBe(9);

        expect(result.characters).toStrictEqual(["M", "y", "-", "S", "t", "r", "i", "n", "g"]);
        expect(result.characters).toHaveLength(9);
        expect(result.characters).toContain<string>('-');
    });

});


describe('StringUtils class', ()=> {
    let sut: StringUtils;

    beforeEach(()=>{
        sut = new StringUtils();
    });

    test('Sanity - valid string', () => {
        const result = sut.toUpperCase('abc');
        
        expect(result).toBe('ABC');
    });

    test('Should throw error on invalid argument (empty string) - function', () => {
        function expectError() {
            const result = sut.toUpperCase('');
        };
        
        expect(expectError).toThrow();
        expect(expectError).toThrowError('Invalid Argument');
    });

    test('Should throw error on invalid argument (empty string) - arrow function', () => {
        expect(() => {
            sut.toUpperCase('')
        }).toThrowError('Invalid Argument');
    });

    test('Should throw error on invalid argument (empty string)', async () => {
        let error;
        try {
            sut.toUpperCase('');
        } catch (e) {
            error = e;
        }
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Invalid Argument');
    })

});
```

The code may look quite similar to Jest because Vitest intelligently adopts the Jest APIs, thereby reducing the learning curve for those transitioning from Jest. This is one of the many reasons why it feels so familiar and yet so refreshingly simple.

To wrap things up, transitioning from Jest to Vitest for a TypeScript project was a refreshing experience for me. With its familiar API and almost non-existent setup, Vitest feels like a game changer, especially for a newcomer to TypeScript like me. And of course, this is without mentioning other features a abilities of Vitest like:
Executing tests in parallel, running tests in watch mode, running tests in debug mode, it's much faster than Jest, and more.

If you're in a similar boat, I encourage you to give Vitest a shot.
