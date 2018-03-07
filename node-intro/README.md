# Getting started with Node and Express

In this activity we are going to learn how to use Node and Express. Node is a JavaScript run-time
environment that can be used to write the server code for a web application.  Express is a web
framework that makes it easy to build a server with an API using Node.

## If you are using nvm

We previously introduced Node in the [Vue WebPacket
Template](https://github.com/zappala/cs260-examples/tree/master/vue-webpack)
activity.

If you setup Node using nvm, then you need to first tell nvm which version of node to use:

```nvm use stable```

## Initialize a new node project

The first step with node is to initialize a new project. You do this with `node init`.

```
mkdir node-intro
cd node-intro
npm init
```

This will ask you a number of questions. Here is how I answered them:

```
package name: (intro) 
version: (1.0.0) 
description: node and express intro
entry point: (index.js) server.js
test command: 
git repository: 
keywords: 
author: 
license: (ISC) 
```

Now you need to install Express. This will automatically save express as a dependency in
`package.json`:

```
npm install express
```

**Tip**: when putting code into a repository that uses node.js, be sure to create a file called
  `.gitignore` in the top level of your repository that contains:

```
node_modules
```

This will prevent you from adding the node modules directory, which often contains many libraries,
into your git repository. Instead, because you have a `package.json`, anyone can use `npm install`
to install all the dependencies for your project. To see how this works, you can always try cloning
your repository to a new directory and do `npm install` there.

## Hello World

We're now going to build a basic node server with Express. Create a file called `server.js` that
contains:

```
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
```

When you run `node server.js`, your server will run and listen on port 3000. You can visit it in a
browser at `localhost:3000`.

In this example, we are using `require` to include the Express module. A good explanation of how
require works is at this article called [Requiring modules in Node.js: Everything you need to
know](Requiring modules in Node.js: Everything you need to know ).

`express()` is the top-level function exported by Express. There are a number of functions defined
on this in the [API documentation](https://expressjs.com/en/4x/api.html).

The next section defines what the server will do when it receives a GET request for `/`. It defines
a function that takes request and response objects, then just sends a string response. This is what
the browser displays when it visits the root of the server.

Finally, the last line starts a web server that listens on port 3000 for incoming requests.

## POST, PUT, and DELETE

When you define an API, you can technically follow any rules you would
like. However, many people (loosely, or sometimes strictly) follow a
design known as REST. If you would like to learn more, this is a good
[REST API
Tutorial](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api).

For now, we'll just introduce the convention used for the HTTP methods. Typically these methods are
used in these situations:

Method   |   Purpose
---------|--------------------
POST     |   Create an object
GET      |   Read an object
PUT	 |   Update an object
DELETE	 |   Delete an object

Notice that if you read down, the letters spell CRUD. This is a common acronym for APIs and
databases, representing the four basic operations you can perform.

Add these lines to `server.js`, just before the call to `listen`:

```
app.post('/', (req, res) => {
  res.send('Here is the response to your POST, man!\n');
});

app.put('/', (req, res) => {
  res.send('I am updated.\n');
});

app.delete('/', (req, res) => {
  res.send('All my memories have been deleted. Are you happy now?\n');
});
```

These just illustrate the different methods. Normally, the methods would access a database to
create, update, or delete particular items in the database.

You can access these URLs using curl:

```
curl -X POST localhost:3000/
curl -X PUT localhost:3000/
curl -X DELETE localhost:3000/
```

## Naming your resources

We can add any kind of path for the API. For example, add these lines to `server.js`, just before
the call to `listen`:

```
app.get('/secret', (req, res) => {
  res.send('Psst. You are being watched.\n');
});

app.get('/api/user/1', (req, res) => {
  res.send({name: "Amy Caprietti", avatar: "/avatars/supergirl.jpg", role: "admin"});
});
```

Notice that we can return JSON responses.

When it comes to desinging a RESTful API, there are a number of [rules
... er, guidelines ... that people
follow](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api).

![guidelines](images/guidelines.jpg)

A good example is:

```
GET /tickets - Retrieves a list of tickets
GET /tickets/12 - Retrieves a specific ticket
POST /tickets - Creates a new ticket
PUT /tickets/12 - Updates ticket #12
DELETE /tickets/12 - Deletes ticket #12
```

## Working example

Let's build a ticket server and a Vue front end for submitting tickets. We'll assume a ticket
has a name and a problem being reported.

First, we need to install an npm library for parsing the body of POST requests.

```
npm install body-parser
```

Next, create a file called `tickets.js` with the following code:

```
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```

This includes the modules we're using and initializes them.

```
app.use(express.static('public'));
```

This tells Express that it should serve any files in the `public` directory as if they were just
static files on a web server. We'll put our Vue code here later on.

```
let tickets = [];
let id = 0;
```

Since we don't have a database setup yet, we're just going to store our tickets in a global variable.

```
app.get('/api/tickets', (req, res) => {
  res.send(tickets);
});
```

This is the REST endpoint for getting all the tickets in the system. We just send our list,
which by default comes with a 200 OK response.

```
app.post('/api/tickets', (req, res) => {
  id = id + 1;
  let ticket = {id:id, name:req.body.name, problem: req.body.problem};
  tickets.push(ticket);
  res.send(ticket);
});
```

This is the REST endpoint for creating a new ticket. We get the parameters from the request body,
create a new ticket, then send back the same ticket we created in a 200 OK response. We've left out
some error checking---we should check whether the request body includes the desired information.

```
app.delete('/api/tickets/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = tickets.map(ticket => { return ticket.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that ticket doesn't exist");
    return;
  }
  tickets.splice(removeIndex, 1);
  res.sendStatus(200);
});
```

This is the REST endpoint for deleting a ticket. The ID is passed in the URL so we use a different
method to parse it. We check whether this ID is present and return a 404 error if it doesn't.
Otherwise, we remove it and return 200 OK.

```
app.listen(3000, () => console.log('Server listening on port 3000!'));
```

This starts the server on port 3000.

## Vue front end

In the `public` directory, you'll find a Vue front end for adding and deleting tickets.  This code
should be easy to follow given what we've done with Vue so far. The only new thing here is that
I used the [axios](https://github.com/axios/axios) library for making Ajax requests instead of
jQuery or fetch.


