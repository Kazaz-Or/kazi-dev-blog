---
title: "Leverage Rewire for Unit Testing in Node.js"
description: Unit testing in Node.js can be challenging. After trying various libraries, I found Rewire to be the most practical for testing purposes
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/rewire.jpg
date: "2023-03-19"
tags: ["Javascript", "NodeJS", "Testing"]
---

I'll start with a full disclosure - Up until now, I have only written unit tests using Jest. However, at my current job, I had the opportunity to work on a small project that allowed me to choose a new testing library.

After some research, I decided to go with Mocha as a test runner and Chai for assertions. Then I reached the fun part - Mocking and Spying.
The most obvious choice was Sinon, which works great as a spy (for example, if you want to know whether a certain log was printed). However, when it came to Mocking (or Stubbing), it wasn't easy at all.

If you're interested - I found this article back then and I found it to be quite true ([why is it so hard to test in NodeJS](https://www.vinnie.work/blog/2021-09-18-why-so-hard-testing-with-es6-imports))

After struggling with Sinon, I turned to the Discord Node.js community with a specific question:

![discordquestion](/images/discord-node-test.png)

The first response was a link to the [rewire](https://github.com/jhnns/rewire) repository. I must say, once I started using it, I couldn't stop. It made mocking incredibly easy.

To install it simply run:

```
npm install rewire
```
import it:
```js
const rewire = require('rewire');
```
To initialize it, you need to "rewire" the module that contains the functions, methods, or variables you'd like to mock.

```js
const mockedIndex = rewire('../../index');
```

So let's look at some examples:

I'll start with the original question I raised in the Node Discord server. 
Here's my original function (just for the sake of the example):

```js
async function updatePolicy(project, policy, file) {
  return Promise.allSettled(Object.entries(file).map(([status]) => {
    try {
      if (!countryRules[country]) {
        return Promise.resolve();
      }
      if (statusDisable(status))
        console.log('disable');
      else if (statusEnable(status))
        console.log('enable');
        [...]
}
```
I wanted a simple test case to check that the correct function is called given the right arguments. 
Since I had many test cases like these, I created a more "generic" function that receives the function I'd like to test as an argument.

```js
// rewire the module
const lib = rewire('../../index');

// generic function

const checkFunctionCall = (functionName, done, file) => {
    lib.__set__(`${functionName}IsCalled`, false); // setting the function under test to isCalled false
    lib.__set__(functionName, () => { // function under test is called
        lib.__set__(`${functionName}IsCalled`, true); // changing the isCalled to true in this case.
    });
    lib.updatePolicy(project, policy, file); // Calling the function that eventually calls the function i'd like to assert on
    assert.equal(lib.__get__(`${functionName}IsCalled`), true); // asserting that isCalled is true
    done();
};

// test case

it('statusEnable function called', (done) => {
    let file = "example argument";

    checkFunctionCall('statusEnable', done, file);
});
```

Doesn't seem so complicated, right?
Moving on to mocking of an async function that should return resolved promise. Let's say this is the original function:

```js
async function persistCatalogs(bucketName, catalogs) {
  const catalogBucket = storageClient.bucket(bucketName);
  return new Promise(async (resolve, reject) => {
    for (const chunk of keyChunks) {
      await Promise.all(chunk.map(async (catalog) => uploadCatalog(catalogBucket, cacheTtl, catalog, catalogs[catalog])));
    }
    resolve();
  })
  .then(() => logger.info("Catalog uploaded!"));
}
```
I'd like to test that given a specific argument, the `uploadCatalog` function was called 12 times.

```js
// stubbed function that will be called when mocking the uploadCatalog function
function uploadCatalogStub() {
  return Promise.resolve('Mocked result');
}
//test case
it("should upload each catalog in chunks", async () => {
    lib.__set__("uploadCatalog", uploadCatalogStub); // rewire will set uploadCatalogStub once uploadCatalog is called
    await lib.persistCatalogs(bucketName, catalogs); // Original function called
    expect(uploadCatalogStub.callCount).to.equal(12); // assertion
});
```

Moving on the mocking a global variable that eventually will be used in a function.

This is the function i'd like to test:

```js
function addEventToCatalog(rawEvent, catalog) {
  rawEvent.countryAvailability.forEach(c => {
    if (COUNTRIES_LIST.includes(c))
      catalog[c].push(event);
    else
      logger.warn(`Unsupported country ${c} on event ${event.assetId}, skipping for catalog`);
  });
```
Now `COUNTRIES_LIST` variable is a global variable, which it's data in it might effect the result of the test. So let's mock it:

```js
lib.__set__('COUNTRIES_LIST', structuredClone(countryCodesData)); //COUNTRIES_LIST is a global variable, here it'll return a clone of another data i chose.
```

and call the tested function is test as usual:

```js
it('should add event to US catalog if countryAvailability includes US', () => {
    lib.addEventToCatalog(rawEvent, catalog);

    expect(catalog.US).to.have.lengthOf(1); // assertion
});
```

In conclusion, `rewire` proved to be the simplest mocking library I've had the opportunity to use in Node.js projects. 
Ultimately, pairing it with a dynamic test runner like Mocha made for an easy choice compared to other libraries. 

As a result, I ended up replacing all other mocks, such as Sinon Stubbing, with Rewire and haven't looked back since.
