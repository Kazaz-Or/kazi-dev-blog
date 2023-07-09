---
title: API Validation with AJV and Json Schema
description: AJV & Json Schema, a generic yet effective method for JavaScript API request validation
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://res.cloudinary.com/practicaldev/image/fetch/s--3k4BZzLZ--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3sx188mik9cm2o04867f.jpg
date: "2023-07-09"
tags: ["JavaScript", "NodeJS"]
---

Before we dive into hands on examples of such validation, let's first understand what is AJV library and see what other options I explored at work when I was in charge of a task to implement such validator in one of our JS services.

The more "Generic" way - [AJV](https://www.npmjs.com/package/ajv)

The "JS syntax" way - [Joi](https://www.npmjs.com/package/joi)

## AJV

The big win you get from JSON Schema is that it's cross platform. JSON Schema validator implementations exist in every major programming language. No matter what language you choose, you can use the same JSON Schema on the frontend and the backend and get consistent validation results. Write once, validate anywhere.

The downside is that because it's cross platform, it's also somewhat limited in what it can do. It's purposely kept simple enough so that it's not too difficult to implement in any programming language. Because JSON Schema isn't a full fledged programming language, it's limited in what it can do. Although I admit, I still haven't encountered with a scenario where I couldn't find a way to validate something.

## Joi

Joi's biggest advantage is its usability. It's easy to use, easy to extend, and it has the full power of JavaScript.

The downside is that if you want to reuse your validation logic on the frontend and the backend, your only choice of language on the backend is node.

You might choose Joi if you use JavaScript for the frontend and the backend and don't anticipate non-JavaScript clients that you need to support. This is a fairly narrow situation, but if it is your situation, you will likely get more out or Joi than AJV/JSON Schema.

## So let's move on to some comparison i've made

Two things really stood out to me and decided were in terms of performance and popularity.

__Performance__

There are many resources out there that compares both libraries performance, but I it's not even close (and to be fair, it's like comparing oranges to apples). AVJ is way faster.
Here are a few resources I found back then - 

- [https://github.com/hapijs/joi/issues/1601](https://github.com/hapijs/joi/issues/1601)
- [https://github.com/icebob/validator-benchmark](https://github.com/icebob/validator-benchmark)

As I said - Not even close.

__Popularity__

Github stars aren't a great measure of popularity. If you look at npm daily downloads you see a very different story (AJV: 18.9M, Joi: 2.2M). JSON Schema is by far more widely used because it is cross platform. AJV is just one implementation in one language. But, if your development stack fits Joi's particular niche, it can be just as good a choice or a better choice than JSON Schema.

![npm-ajv-vs-joi](/images/npm-ajv-vs-joi.jpeg)

Here's a nice [NPMCompare](https://npmcompare.com/compare/ajv,joi,schema-inspector) resource I used.

## That's pretty much it. Let's move on to some AJV and Json Schema examples

For the sake of the example, we'll start with an express route which its post method has an api validator middleware where we're passing the schema and validation type (body, params, query, etc..). In this case we'll use validator for the body of the request.

__Route:__

```js
const router = express.Router();

// Define a route to '/devices', with GET and POST methods.
// For POST requests, an API validation middleware is applied to check the request body against a schema.
router.route('/devices')
    .get(
        getDevices() // business logic
    )
    .post(
        apiValidator(postDeviceSchema, validationType.BODY), // validation middleware
        postDevices() // business logic
    );
```

__Generic validation middleware:__

```js
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Create an instance of AJV, adding all formats for validation.
const ajvInstance = new Ajv({ allErrors: true });
addFormats(ajvInstance);

// Define the types of validations that can be performed.
const validationType = {
    PARAMS: 'params',
    BODY: 'body'
};

// Create an API validator middleware function. This function uses AJV to validate the data
// of the request (either body or params) against a provided schema. 
// If the data is not valid, an error is returned.
function apiValidator(schema, type) {
    return (req, res, next) => {
        try {
            let data = null;
            if(type === validationType.BODY){
                data = req.body;
            }else if (type === validationType.PARAMS){
                data = req.params;
            }
            const ajvValidate = ajvInstance.compile(schema);
            const valid = ajvValidate(data);
            if (!valid) {
                const errors = ajvValidate.errors;
                res.status(400).json(errors);
                return;
            }
            next();
        }
        catch (err) {
            res.status(500).json({message: 'Internal Server Error, Failed to validate request'});
		}
    };
}
```

The `apiValidator` middleware takes a schema and the type of validation to be performed (e.g., BODY or PARAMS). The middleware compiles the schema using AJV and validates the request data against it. If the validation fails, it sends a 400 status response detailing the errors.



__Post device schema:__

```js
// Base schema for device data. This includes various properties that the device should have, 
// along with their expected types and constraints.

const deviceProperties = {
    deviceName: {type: "string"},
    manufacturer: {type: "string", enum: config.get('allowedManufacturers')},
    model: {type: "string", minLength: 3, maxLength:30},
    os: {type: "string", enum: config.get('allowedOs')},
    osVersion: {type: "string", minLength: 1, maxLength:30},
    serialNumber: {type: "string", minLength: 5, maxLength:30},
    site: {type: "string", enum: config.get('allowedSite')},
    ipAddress: {type: "string",
                "anyOf": [
                    {"format": "ipv4"},
                    {"format": "ipv6"}]}
};

// Extended schema for POST requests. This extends the base device schema, 
// adding a requirement for each property and disallowing additional properties.

const postDeviceSchema = {
    type: "object",
    properties: deviceProperties,
    required: ["deviceName", "manufacturer", "model", "os", "osVersion", "serialNumber", "site", "ipAddress"],
    additionalProperties: false,
};
```

So what do we have in the schemas that isn't obvious like expecting a string and min/max length?

`manufacturer`: A string that must be one of the allowed manufacturers. The list of allowed manufacturers is retrieved from the application's configuration (using config.get('allowedManufacturers')). The use of the enum keyword ensures that the manufacturer value provided must match one of the ones in this list.

`ipAddress`: A string that must be either an IPv4 or IPv6 address. This is accomplished by providing an array of schema objects to the `anyOf` keyword. Each schema object has a format keyword, which AJV uses to match the data to a specific data format. In this case, the ipAddress property value will be checked against both the IPv4 and IPv6 formats, and if it matches either, it will be considered valid.

For the `postDeviceSchema`, all these properties are required, and no additional properties are allowed (enforced by additionalProperties: false). This means a valid device object must have all of these properties and cannot have any other properties.

There are many other options available in JSON Schema, such as regex (which is used as `pattern`, and many different formats such as data, uuid, etc).


Now let's see some practical use cases?

In the following example, we'll demonstrate a scenario in which a POST request fails validation because the request body doesn't match our defined postDeviceSchema.

Here's the example payload for the request:

```json
{
    "deviceName": "TestDevice",
    "manufacturer": "UnknownManufacturer", // this manufacturer is not in the allowed list
    "model": "Model1",
    "os": "OS1",
    "osVersion": "1.0",
    "serialNumber": "12345",
    "site": "Site1",
    "ipAddress": "192.168.1.1"
}
```

In this example, the manufacturer is "UnknownManufacturer", which is not in the allowed list defined in postDeviceSchema. When the request is sent, the apiValidator middleware will compare the request body with postDeviceSchema. Since "UnknownManufacturer" is not an allowed value, ajvValidate(data) will return false, indicating the validation failed.

The middleware will then gather the error information from ajvValidate.errors and send a 400 status response with the error details. This allows the client to understand what part of the request was invalid and take corrective action.

Here's an example of what the error response could look like:

```json
[
    {
        "keyword": "enum",
        "dataPath": ".manufacturer",
        "schemaPath": "#/properties/manufacturer/enum",
        "params": {
            "allowedValues": ["Manufacturer1", "Manufacturer2", "Manufacturer3"]
        },
        "message": "should be equal to one of the allowed values"
    }
]
```

The keyword tells us that the error relates to an 'enum' check. dataPath shows where in the data the error occurred, and schemaPath shows where in the schema the error was defined. params gives us additional context, such as what the allowed values for this field are. Finally, message provides a human-readable description of the error.

This kind of detailed error response is beneficial for debugging and allows clients to easily understand and correct their mistakes.

Adding to this, there are many other features which weren't covered in this blog post but AJV can handle without any issues, such as `Nested schema validation`, `Async validation` and `Custom validation keywords`.