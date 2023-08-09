---
title: "Explore Mocking In Node.js Using Sinon"
description: Unit testing and mocking in Node.js with Sinon, get familiar with basic Spies, Stubs, Fakes, and Mocks, concepts.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/unittestssinon.webp
date: "2023-08-09"
tags: ["JavaScript", "NodeJS", "Testing", "Sinon"]
---

While working on a project at work, I delved into unit tests with Sinon v8. I discovered that unit tests using Sinon can sometimes pose challenges, so here's a glimpse of what I learned.
For this project I used Mocha as a test runner, Chai for assertions, Sinon for mocking and Proxyquire for sandboxing.

This is our demo app code that we will be using for this article. It is a simple Node.js application that manipulates files on the file system.

```js
const {
    readdir,
    readdirSync,
    readFileSync,
    unlinkSync,
    writeFileSync
  } = require("fs");
  const util = require("util");
  
  module.exports = {
    createFile: filename => {
      if (!filename) {
        throw new Error("Must supply file name");
      }
  
      return writeFileSync(`./data/${filename}`, "", { flag: "wx" });
    },
    createFileInjected: (filename, fs) => {
      if (!filename) {
        throw new Error("Must supply file name");
      }
  
      return fs.writeFileSync(`./data/${filename}`, "", { flag: "wx" });
    },
    createFileSafe: filename => {
      if (!filename) {
        throw new Error("Must supply file name");
      }
  
      try {
        const result = writeFileSync(`./data/${filename}`, "", { flag: "wx" });
      } catch (error) {
        const files = readdirSync("./data");
        const [name, extension] = filename.split(".");
  
        let max =
          files
            .filter(f => f.match(/test[1-9]/))
            .map(f => Number(f.replace(name, "").replace(`.${extension}`, "")))
            .sort()
            .pop() || 0;
  
        const newName = `${name}${++max}.${extension}`;
        writeFileSync(`./data/${newName}`, "", { flag: "wx" });
      }
    },
    deleteFile: filename => {
      if (!filename) {
        throw new Error("Must supply file name");
      }
  
      return unlinkSync(`./data/${filename}`);
    },
    getFile: filename => {
      if (!filename) {
        throw new Error("Must supply file name");
      }
  
      return readFileSync(`./data/${filename}`);
    },
    getAllFiles: cb => {
      readdir("./data", cb);
    },
    getAllFilesPromise: () => {
      const readPromise = util.promisify(readdir);
      return readPromise("./data");
    },
    saveFile: (filename, contents) => {
      if (!filename) {
        throw new Error("Must supply file name");
      }
  
      return writeFileSync(`./data/${filename}`, contents);
    }
  };
```

### Spies

Spies are a good choice for monitoring functions - such as tracking logs, check if a function is being called, etc. You can think about it as Spies are good at answering questions about your methods.

Consider this potentially misleading use case for a spy:

```js
  describe("File Management", () => {
    afterEach(() => {
        sinon.restore();
    });

  it("Should create a new file", () => {
    const writeSpy = sinon.spy(fs, "writeFileSync");
    const fileManagement = proxyquire("./file.management", { fs });

    fileManagement.createFile("test.txt");
    expect(writeSpy.calledWith("./data/test.txt", "")).to.be.true;
  });
  });
```
In the given example, the test might pass once but fail on subsequent runs due to an existing `test.txt` file, causing an exception. Spies don't always prevent such side effects. In situations like these, Stubs can be a better choice.

### Stubs

Stubs ensure safety during testing. They can manipulate functions and handle side effects like calling APIs or interacting with third-party libraries.
The common stub approaches are side effects like returning a specific values (basically override the original function return value), throw exceptions, resolve or reject promises to understand the function behavior according to real use cases, or call a separate fake function in order to keep the function under test isolated.
There are also other common use cases such as saving time in your tests if you have function with longer execution time.

Using our previous example but with a stub:

```js
describe("File Management", () => {
  afterEach(() => {
      sinon.restore();
  });

  it("Should create a new file", () => {
      const writeStub = sinon.stub(fs, "writeFileSync");
      const fileManagement = proxyquire("./file.management", { fs });

      fileManagement.createFile("test.txt");

      expect(writeStub.callCount).to.equal(1);
  });
});
```

Here, no actual file is created since we override the `writeFileSync` function, making repeated test runs consistent. It's due to the fact that we override the `writeFileSync` function using a stub. Meaning that unlike the spy use case, I can now run the test multiple times and it won’t fail after the first execution.

But what if we actually want to check that in the use case of file already exists an exception is raised? 

We can modify our stub for the dependent `writeFileSync` function to throw an exception and then check that createFile function is behaving as expected.

such as follows:

```js
it("Should throw an exception if file already exists", () => {
    const writeStub = sinon.stub(fs, "writeFileSync");
    writeStub.throws(new Error());
    const fileManagement = proxyquire("./file.management", { fs });

    expect(() => fileManagement.createFile("test.txt")).to.throw();
});
```

But in most production cases, you’d like to throw an exception based on the actual use case, not every time.
So we can configure our stub to throw exception only in a specific case (which is our test case) using the `withArgs` Sinon function.

```js
it("createFileSafe should create a file named test1 when test file already exists", () => {
    const writeStub = sinon.stub(fs, "writeFileSync");
    const readStub = sinon.stub(fs, "readdirSync");

    const fileManagement = proxyquire("./file.management", { fs });

    writeStub.withArgs("./data/test.txt").throws(new Error());
    writeStub.returns(undefined);
    readStub.returns(["test.txt"]);
});
```

You can see that in this case we throw an exception only when the function is being called with this specific argument of test file ("./data/test.txt").

Another common example, is to check what happens if `createFile` function is being called without required argument.

```js
it("Should not create a new file if no name is specified", () => {
    const writeStub = sinon.stub(fs, "writeFileSync");
    const fileManagement = proxyquire("./file.management", { fs });

    try {
        fileManagement.createFile();
    } catch (err) {}
    expect(writeStub.notCalled).to.be.true;
});
```
Thing we need to take into account is if the function throws an exception, we have to wrap the call in the function of our test with a try-catch block and then make the assertion.

Now let's explore an Async use case.

Async functions bring a bit of complexity, so understanding JS callbacks helps. In Node, callbacks typically have an error as their first parameter and the return value as the second. 

```js
(Err, data) => {}
```

So in such cases you can emulate a returned callback using Sinon's `yields` function.

```js
it("getAllFiles should return a list of files", () => {
    const readStub = sinon.stub(fs, "readdir");
    const fileManagement = proxyquire("./file.management", { fs });
    readStub.yields(null, ["test.txt"]);

    fileManagement.getAllFiles((err, data) => { 
        expect(data).to.eql(["test.txt"]);
    });
});
```

Couple of things to note;

In the test we should make the assertion inside a callback.

The stub yields null as the err parameter, and the array with the file name as the data of the callback.

While yield is nice to emulate callbacks, a lot of applications have moved to promises instead, so let’s see how we can deal with promises as well.


```js
it("getAllFilesPromise should return a list of files", () => {
    const readStub = sinon.stub(fs, "readdir");

    const fileManagement = proxyquire("./file.management", { fs });
    readStub.resolves(["test.txt"]);

    return fileManagement.getAllFilesPromise().then(files => expect(files).to.eql(["test.txt"]));
});
```
As you can see, you can just tell the stub to resolve or reject the promise using the data you’d expect.

There is another important use case with Sinon, which is using `callsFake`.
callsFake function usually return a single argument, but unlike `returns` and `yields`, it is used to return a function.

Why would I want to return a function? One example, is if I have some logic I want to execute.

For example, here I’ll use the spread operator to gain access in the stub to the arguments:

```js
const writeStub = sinon.stub(fs, “writeFileSync”).callsFake((...args) => {});
```
The receiving arguments in this case are `“./data/test.txt”`, `""`, `{ flag: “wx” }`.

You can also add behavior to a function (although I think it is less common) using the `addBehavior` function.

```js
sinon.addBehavior(“logsCall”, (fake, msg) => {
	console.log(msg)’
});
```
Then you can use this new defined behavior as a method on your stub.

But two important notes on `addBehavior`; Behaviors must be defined before the stubs, but they can be also chained.

So you want, you can do something like this:

```js
myStub.logsCall(“called”).returns(“hi”);
```

### Fakes

Unlike Stubs, Fakes are immutable and don't replace the default function behavior automatically.

So let’s see the differences.

Replacing a Spy with a Fake:

```js
it("Should create a new file", () => {
      const writeFake = sinon.fake(fs.writeFileSync);
      sinon.replace(fs, "writeFileSync", writeFake);
      const fileManagement = proxyquire("./file.management", { fs });

      fileManagement.createFile("test.txt");

      expect(writeFake.calledWith("./data/test.txt", "")).to.be.true;
  });
```

Note that unlike stub, fake receives one argument (which in our case it is the `module.function`).
Also, note that I had to specify (using Sinon’s replace function) what will be the behavior or else it will act as the default behavior. 
The `replace` function takes 3 arguments (module, function and the return fake).

In the case above, the test will pass but will fail after another execution due to the same issue we had with our Spy (text.txt) file is created.

Replacing a Stub with a Fake:

One important concept, is instead of faking the function (as you do with Stubs), you use the property, not the function, then using Sinon’s replace function, override the default behavior. 

```js
it("Should throw an exception if file already exists", () => {
    const writeFake = sinon.fake.throws(new Error());
    sinon.replace(fs, "writeFileSync", writeFake);
    const fileManagement = proxyquire("./file.management", { fs });

    expect(() => fileManagement.createFile("test.txt")).to.throw();
});
```

Now let’s do the same for an async function:

```js
it("getAllFiles should return a list of files", () => {
    const readFake = sinon.fake.yields(null, ["test.txt"]);
    sinon.replace(fs, "readdir", readFake);
    const fileManagement = proxyquire("./file.management", { fs });

    fileManagement.getAllFiles((err, data) => {
        expect(data).to.eql(["test.txt"]);
    });
});
```
I had to chain the behavior or else the test will fail.

Most of the use cases which using Fakes are usually when you only need one behavior (not based on things like different arguments, etc).

### Mocks

Basically, we do not have re-define what a mock is because it’s pretty strait forward, although it’s a matter of practice. With mocks you first define what to expect and then assert on it.

If we compare it to Stubbing, you’ll need to do something like this:

```js
// stub
myStub.returns(1);
Const result = myStub();
expect(result).to.eql(1);
```
With mocks however it’s almost inverted, for example:

```js
// mock
expect(myStub).to.return(1); // setting expectation first
myStub(); // then calls the function
```

Let’s use one of our “real” example as above:

```js
it("Should call writeFileSync when creating a file", () => {
    const writeMock = sinon.mock(fs);
    writeMock.expects("writeFileSync").once().withArgs("./data/test.txt", "");
    const fileManagement = proxyquire("./file.management", { fs });

    fileManagement.createFile("test.txt", "");
    
    writeMock.verify();
});
```

You can note that I’m mocking an entire module (`fs` module in this case).
I’m setting expectation first using the `expects` function and then asserts using the `verify` function.
Same as stubs, the test will pass but the test.txt file won’t be created and that’s because the mock is intercepting the function under test just like a stub does.

Let's take a look at another test case:

```js
it("createFileSafe should created a new file with a number appended", () => {
    const writeMock = sinon.mock(fs);
    writeMock.expects("writeFileSync").withArgs("./data/test.txt").throws();
    writeMock.expects("writeFileSync").withArgs("./data/test1.txt").once();
    writeMock.expects("readdirSync").returns(["test.txt"]).once();
    const fileManagement = proxyquire("./file.management", { fs });

    fileManagement.createFileSafe("test.txt");

    writeMock.verify();
});
```

What if we want to check a function was NOT called?

```js
it("createFile should never call writeFileSync when the file is empty", () => {
    const writeMock = sinon.mock(fs);
    writeMock.expects("writeFileSync").never();

    const fileManagement = proxyquire("./file.management", { fs });

    try {
      fileManagement.createFile();
    } catch (err) {}

    writeMock.verify();
  });
```

As you can see, it’s pretty strait forward, you can just utilize the `never()` function.


### To conclude
__Spies__ are great for answering questions such as how many times is this function called, with which argument, etc. 
It’s considered as bad practice to try and control a function.

__Stubs__ is like a stunt double - It keeps us safe from all the side effects of the functions under test like exceptions, calls for APIs or a third party application/libraries, and in any case of forcing a behavior like throwing exception, it’s the stub that does it, not the actual function under test.

__Fake__ is a method to combine the two together, they ask questions AND defines behavior.
It has the ability to set a behavior, record arguments, return values, emulates exceptions and more.

Unlike Stubs, Fakes are immutable, and do not replace automatically the original functions behavior.
Unlike stubs, you cannot modify its behavior based on received args or the number of times it’s called, and there are couple of missing functions that are commonly being used with stubs such as `callsFake()`, `callsThrough()` and `addBehavior()`.

__Mocks__ - With mocks you first define what to expect and then assert on it and usually you mock an entire module instead of a specific function.

Unlike Fakes, Mocks do contains all of the Spies and Stubs function, with some additional function on top of it (like `never()`, `atLeast()` AND `atMost()`).

As you can see there’s a lot of commonality in all those test doubles, but also some uniqueness in each one of them.

_Code examples were taken from [Nate Taylor PluralSight Course on Mocking Node JS with Sinon](https://app.pluralsight.com/library/courses/mocking-nodejs-sinon). Highly recommended!_
