---
title: "Testing REST API with Cypress is easy"
description: Most common use cases of Cypress.io are UI & Visual testing. But, employing Cypress for testing REST APIs can also be quite efficient.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/cypressapitesting.png
date: "2023-04-30"
tags: ["JavaScript", "Cypress.io", "Testing"]
---

Cypress.io offers an intuitive approach to REST API testing, primarily due to its user-friendly design and well-structured documentation. The platform supports JavaScript, which simplifies the learning curve for developers already familiar with it. Additionally, Cypress.io's real-time reloading feature allows for efficient test development, as developers can observe test results instantaneously without manually refreshing the test runner.

Furthermore, the platform's robust API enables seamless handling of network requests and responses, providing developers with comprehensive tools to test and validate various REST API endpoints. By incorporating Cypress.io's built-in assertions and custom commands, developers can create test suites with enhanced readability and maintainability.

But, Let's take it the practical way - It's better to start with some examples.

So for the sake of the example, let's create a small express application with some register and login endpoints, install a data validation library (Joi), and create some basic user model.

Source code can be found in this [repository](https://github.com/Kazaz-Or/automation-projects/tree/develop/APITestingUsingCypress).

So i'll start with the data validation Schemas, which are quite straightforward. First, create a `dataValidation.js` file in your root directory of your project. As you can tell, i used `Joi` library (`npm install joi`).

```javascript
const Joi = require('@hapi/joi');

class DataValidation{
    static registerValidation(request){
        const validationSchema = Joi.object({
            name: Joi.string().min(2).required(),
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(8).required()
        })
        return validationSchema.validate(request);
    };
    
    static loginValidation(request){
        const validationSchema = Joi.object({
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(8).required()
        })
        return validationSchema.validate(request);
    };     
};

module.exports = {DataValidation};
```

Next, Let's create a user model Scheme using `mongoose` (can be installed with `npm install mongoose`). Create a file called Users.js under model directory.

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email:{
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password:{
        type: String,
        required: true,
        min: 6,
        max: 1000,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
```

Finally, we can create are endpoints under routes directory. Note, that I used `express` and `bcryptjs` here.
Now, create a file named auth.js under routes directory, and let's create two routes - once for registration, and one for login.

```javascript
const router = require('express').Router();
const User = require('../model/Users');
const { DataValidation } = require('../dataValidation');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');


router.post('/register', async (req, res) => {
    const {error} = DataValidation.registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }catch (err) {
        res.status(400).send(err);
    }
});


router.post('/login', async (req, res) => {
    const {error} = DataValidation.loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const userExists = await Users.findOne({email: req.body.email});
    if(!userExists) return res.status(400).send('Email not found');

    const validPassword = await bcrypt.compare(req.body.password, userExists.password);
    if(!validPassword) return res.status(401).send('Invalid password');

    res.status(200).send('Logged in successfully');
});


module.exports = router;
```

If you want to make sure everything works correctly, simply start the application `npm start`, and you can just send requests to both endpoints by using cURL.

```bash
register endpoint:

curl -d '{"name": "Kazi Tester", "email": "kazi@dev.io", "password": "simplepass"}' -H "Content-Type: application/json" http://localhost:3000/api/user/register

login endpoint:

curl -d '{"email": "kazi@dev.io", "password": "simplepass"}' -H "Content-Type: application/json" http://localhost:3000/api/user/login 
```

## And now let's get to testing!

First, Let's install Cypress `npm install cypress`.

Once done, under e2e directory, let create two files, one for each route - `login.spec.cy.js` and `register.spec.cy.js`.

Starting with the register endpoint:

I installed the `guid` library just for the sake of easy randomization of users creation (of course, this method shouldn't be used in a real production testing environment, this is just for the sake of example).

So I guess this route is quite basic, therefore, let's write some sanity tests first which will assert (or more precise expect), on status code and correct response.

```javascript
const registerEndpoint = 'http://localhost:3000/api/user/register';
const Guid = require('guid');


describe('User Registration - Sanity', () => {
  it('User Registration - Status Code 200', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      body: {
        name: 'tester',
        email: dynamicEmail,
        password: '12345678'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(200);
    } )
  });

  it('User Registration - Response', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      body: {
        name: 'tester',
        email: dynamicEmail,
        password: '12345678'
      }
    })
    .then((response) => {
        expect(response.body.name).to.equal('tester');
        expect(response.body.email).to.equal(dynamicEmail);
        expect(response.body.password).to.not.equal('123456');
    } )
  });
});
```

The first test checks if the response status code is 200 (OK) when a user registration request is made with valid data. A unique email address is generated using the Guid library, and a POST request is made to the registration endpoint with a predefined name, the dynamic email, and a password.

The second test, verifies if the response contains the correct name, email, and password fields. The test checks if the name matches the provided input, the email address matches the generated dynamic email, and the password does not match the plain-text password provided in the request. This test ensures that the registration API is functioning correctly and returning the expected results.


Let's move on to some schema validation tests.

```javascript

describe('User Registration - Schema Fields Validation', () => {
  it('User Registration missing name field', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        email: dynamicEmail,
        password: '12345678'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"name" is required');
    } )
  });

  it('User Registration missing email field', () => {
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        name: 'tester',
        password: '12345678'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"email" is required');
    } )
  });

  it('User Registration missing password field', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        name: 'tester',
        email: dynamicEmail
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"password" is required');
    } )
  });

  it('User Registration name field under minimum chars', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        name: 't',
        email: dynamicEmail,
        password: '12345678'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"name" length must be at least 2 characters long');
    } )
  });

  it('User Registration email field invalid email', () => {
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        name: 'test-user',
        email: 'tester.example.com@',
        password: '12345678'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"email" must be a valid email');
    } )
  });

  it('User Registration password field under minimum chars', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        name: 'test-user',
        email: dynamicEmail,
        password: '1234567'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"password" length must be at least 8 characters long');
    } )
  });

  it('User Registration name field wrong type', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        name: 5352,
        email: dynamicEmail,
        password: '1234235967'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"name" must be a string');
    } )
  });

  it('User Registration password field wrong type', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        name: '5352user',
        email: dynamicEmail,
        password: 1235674533
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"password" must be a string');
    } )
  });

  it('User Registration email field wrong type', () => {
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      failOnStatusCode: false,
      body: {
        name: '5352user',
        email: true,
        password: '1235674pass'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"email" must be a string');
    } )
  });

});
```
These tests are a series of schema validation tests. They are focusing on verifying that the API correctly handles and responds to requests with missing or invalid data in the request body.

Each test within the suite targets a specific scenario where a required field is either missing, has an invalid value, or has a value that does not meet the required constraints.

The tests cover the following scenarios:

Missing name field in the request body
Missing email field in the request body
Missing password field in the request body
Name field with fewer than the minimum required characters
Email field with an invalid email address
Password field with fewer than the minimum required characters
Name field with an incorrect data type (number instead of a string)
Password field with an incorrect data type (number instead of a string)
Email field with an incorrect data type (boolean instead of a string)
For each test, a POST request is made to the registration endpoint with the specific invalid data, and the response is checked for the expected status code (400) and an appropriate error message. These tests ensure that the registration API correctly validates the request body schema and provides meaningful error messages for invalid data.


So far so good - Why not create some negative tests cases as well?

```javascript

describe('User Registration - Negative Cases', () => {
  it('User Registration without payload - Response 400', () => {
    cy.request({
      method: 'POST', 
      url: registerEndpoint, 
      failOnStatusCode: false
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"name" is required');
    } )
  });

  it('User Registration - Special chars in name field', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      body: {
        name: 'tester!@#$%^&*()-_=+/.><~`  ',
        email: dynamicEmail,
        password: '12345678'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(200);
    } )
  });

  it('User Registration - Special chars in password field', () => {
    let dynamicEmail = Guid.raw() + '@example.com'
    cy.request({
      method: 'POST', 
      url: registerEndpoint,
      body: {
        name: 'testerspecialchars',
        email: dynamicEmail,
        password: '123456!@#$%^&*()-_=+/.><~`  '
      }
    })
    .then((response) => {
        expect(response.status).to.equal(200);
    } )
  });

  it('User Registration - Registration with an already exists email', () => {
      cy.request({
        method: 'POST', 
        url: registerEndpoint,
        failOnStatusCode: false,
        body: {
          name: 'tester',
          email: 'tester@example.com',
          password: '12345678'
        }
      })
      .then((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.equal('Email already exists');
      } )
    });
});
```

This test suite includes a set of negative test cases for the user registration route using Cypress.io. These tests focus on verifying that the API can handle and respond to various unfavorable or edge-case scenarios during user registration.

These negative test cases help ensure that the registration API can properly handle different edge cases and return the appropriate responses for various input scenarios.

![register-spec](https://user-images.githubusercontent.com/83350680/191088312-76a48269-703e-41cf-aee7-5be1963670bb.jpeg)

Let's finish with the login endpoint!

Same steps, starting with some sanity tests first.

```javascript
const loginEndpoint = 'http://localhost:3000/api/user/login';


describe('User Login - Sanity', () => {
  it('User Login - Status Code 200', () => {
    cy.request({
      method: 'POST', 
      url: loginEndpoint,
      body: {
        email: 'static@test.io',
        password: 'simplepass'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(200);
    } )
  });

  it('User Login - Response', () => {
    cy.request({
      method: 'POST', 
      url: loginEndpoint,
      body: {
        email: 'static@test.io',
        password: 'simplepass'
      }
    })
    .then((response) => {
        expect(response.body).to.equal('Logged in successfully');
    } )
  });

  it('User Login - Wrong email', () => {
    cy.request({
      method: 'POST', 
      url: loginEndpoint,
      failOnStatusCode: false,
      body: {
        email: 'static1@test.io',
        password: 'simplepass'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('Email not found');
    } )
  });

  it('User Login - Wrong password', () => {
    cy.request({
      method: 'POST', 
      url: loginEndpoint,
      failOnStatusCode: false,
      body: {
        email: 'static@test.io',
        password: 'simplepass1'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.equal('Invalid password');
    } )
  });
});

```

These tests focusing on validating the status code and response content of the API for various login scenarios.
These sanity tests help ensure that the login API can properly handle different scenarios and return the appropriate responses for valid and invalid login attempts.

Then moving on to some edge cases and negative cases.

```javascript

describe('User Login - Error Cases', () => {
  it('User Login - Missing email field', () => {
    cy.request({
      method: 'POST', 
      url: loginEndpoint,
      failOnStatusCode: false,
      body: {
        password: 'simplepass'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"email" is required');
    } )
  });

  it('User Login - Missing password field', () => {
    cy.request({
      method: 'POST', 
      url: loginEndpoint,
      failOnStatusCode: false,
      body: {
        email: 'static@test.io'
      }
    })
    .then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.equal('"password" is required');
    } )
  });

});
```

These tests focusing on verifying that the API can handle and respond to various unfavorable or edge-case scenarios during user login.
These error and edge case tests help ensure that the login API can properly handle different scenarios and return the appropriate responses for various input situations.

![login-spec](https://user-images.githubusercontent.com/83350680/191088279-6bb19b69-6bf0-4354-99c4-08ece316fa43.jpeg)

Not too bad, right?

Don't forget to run the test by running `npm test`!

![test-summary](https://user-images.githubusercontent.com/83350680/191088369-19a49e8a-a24b-4fc0-8142-6b7560f2601e.jpeg)

The source code of the simple express application and the tests, can be found here - [https://github.com/Kazaz-Or/APITestingUsingCypress](https://github.com/Kazaz-Or/automation-projects/tree/develop/APITestingUsingCypress)