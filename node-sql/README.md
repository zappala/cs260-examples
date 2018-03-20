# Using a SQL database with Node.js

A SQL or relational database contains a set of tables, with relationships between the tables.
Basic SQL statements include the following:

| SQL Command              | purpose                            |
| ------------------------ | ---------------------------------- |
| CREATE DATABASE tickets; | creates a database called tickets  |
| CREATE TABLE tickets (id int NOT NULL, problem varchar(50));  | creates a table called tickets |
| INSERT INTO tickets (name,problem) VALUES ("Daniel","It's broken"); | inserts a row into the tickets table | DELETE FROM tickets WHERE id=1"; | deletes the first ticket from the tickets table |
| DROP TABLE tickets       | drops (removes) the tickets table  |
| DROP DATABASE tickets    | drops (removes) the tickets database |

We are going to use:

* [MariaDB](https://mariadb.org/) or [MySQL](https://www.mysql.com/) for the database
* [knex](http://knexjs.org/) for creating database tables and migrations

## Install MariaDB or MySQL

MariaDB is a fork of the MySQL project that remains purely open source. Oracle runs MySQL.  For now,
they are drop-in replacements that do the same thing, but they may diverge at some point.

### Linux

To install on Linux:

```
sudo apt install mariadb-server mysql-client
mysql_secure_installation
```

Be sure to set a good root password. See the [documentation on this
script](https://mariadb.com/kb/en/library/mysql_secure_installation/) for why it is important.

### MacOS

To install on MacOS, follow [this tutorial for MariaDB](https://mariadb.com/kb/en/library/installing-mariadb-on-macos-using-homebrew/) or [this tutorial for MySQL](https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e)

### Windows

To install on Windows, you can [download a Windows installer](https://downloads.mariadb.org/).

## Create a database

We need to create a database for our app to use. We'll call it `tickets`.

### Linux

Use the mysql command line client:

```
mysql -u root -p
MariaDB [(none)]> create database tickets;
MariaDB [(none)]> quit;
```

### Mac OS

Use [Sequel Pro](http://www.sequelpro.com/)

### Windows

Use [HeidiSQL](https://www.heidisql.com/)

## Setup Node

We now need to setup a Node project. Create a new directory and initialize the project.

```
mkdir node-sql
cd node-sql
npm init
```

Here is how I answered the questions:

```
package name: (sql) node-sql
>version: (1.0.0) 
description: Learning SQL
entry point: (index.js) server.js
test command: 
git repository: 
keywords: 
author: 
license: (ISC) 
```

Install some packages we'll use:

```
npm install express body-parser mariasql knex
```

(substitute mysql if you are using mysql)


## Create a database table

We're going to use knex to create our database tables, through a series of migrations. The first thing
we'll do is initialize knex:

```
npx knex init
```

Now edit `knexfile.js` so it has the details needed for your database connection:

```
  development: {
    client: 'mariasql',
    connection: {
      host     : '127.0.0.1',
      user     : 'root',
      password : '',
      db : 'tickets',
      charset  : 'utf8'
    }
  },
```

Put in the password you chose when you setup MariaDB or MySQL.

Next, we'll make a migration to create a table called `tickets`.

```
npx knex migrate:make tickets
```

This creates a file in the `migrations` directory whose name is based on today's date. Mine is called
`20180317125732_tickets.js`

Edit your migration so it contains:

```
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tickets', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.text('problem');
      table.date('created_at');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tickets'),
  ]);
};
```

This tells knex to create a table called `tickets` with four columns: a unique `id` for each row, a `name` for the person creating
the ticket, a `problem` for the problem description, and a date for when the problem was reported.

To run this migration, execute:

```
npx knex migrate:latest
```

This will run all of the migrations, up to the latest, to be sure your database structure is up to date.

To check that our database has been modified as desired, we can do the following on the command
line. If you use a GUI to manage the database, the commands will be different.

```
mysql -u root -p
MariaDB [(none)]> use tickets;
MariaDB [tickets]> describe tickets;
MariaDB [tickets]> quit
```

## Build an API that uses the database

Now we need to create a server that can use the database. Create `server.js` and add the following:

```
// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))
```

This is the boilerplate setup for Express we've done in the past.

```
// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const db = require('knex')(config);
```

This is the setup needed for knex. We pull in the environment so that
it is easy to switch database configuration for development vs. production.

```
app.get('/api/tickets', (req, res) => {
  db('tickets').select().from('tickets').then(tickets => {
    res.send(tickets);
  }).catch(error => {
    res.status(500).json({ error });
  });
});
```

This is the REST endpoint for getting all the tickets. This builds a SQL query that finds all the
tickets in the database: "SELECT * FROM TICKETS".


```
app.post('/api/tickets', (req, res) => {
  db('tickets').insert({name:req.body.name, problem: req.body.problem, created_at: new Date()}).then(ticket => {
    res.status(200).json({id:ticket[0]});
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});
```

This is the REST endpoint for creating a new ticket. This builds a SQL query to insert a new ticket:
"INSERT INTO tickets (name,problem,created_at) VALUES (req.body.name,req.body.problem,new Date())".

```
app.delete('/api/tickets/:id', (req, res) => {
  let id = parseInt(req.params.id);
  db('tickets').where('id',id).del().then(tickets => {
    res.sendStatus(200);    
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});
```

This is the REST endpoint for deleting a ticket. This builds a SQL query to delete a ticket:
"DELETE FROM tickets WHERE id=req.params.id";

```
app.listen(3000, () => console.log('Server listening on port 3000!'))
```

This tells Node to create a web server that listens on port 3000.

## Front end

We will use the following for our HTML, in `public/index.html`:

```
<!DOCTYPE html>
<html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css"/>
    <title>Vue Tickets</title>
  </head>
  <body>
    <div id="app">
      <h1>Ticket System</h1>
      <form v-on:submit.prevent="addTicket">
	<input v-model="addedName" placeholder="Name">
	<br/>
	<textarea v-model="addedProblem" placeholder="Problem"></textarea>
	<button type="submit">Submit</button>
      </form>
      <h3>Tickets</h3>
      <div v-for="ticket in tickets">
	<hr>
	<div class="ticket">
	  <div class="problem">
	    <p>Problem: {{ticket.problem}}</p>
	    <p>Reported by: {{ticket.name}}</p>
	    <p>Reported on: {{ticket | dateFormat }}</p>
	  </div>
	  <div class="delete">
	    <button v-on:click="deleteTicket(ticket)" class="delete">Delete</button>
	  </div>
	</div>
      </div>

    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js" integrity="sha256-mpnrJ5DpEZZkwkE1ZgkEQQJW/46CSEh/STrZKOB/qoM=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.js" integrity="sha256-pU9euBaEcVl8Gtg+FRYCtin2vKLN8sx5/4npZDmY2VA=" crossorigin="anonymous"></script>
    <script src="/script.js"></script>
  </body>
</html>
```

This is the Vue code in `public/script.js`:

```
var app = new Vue({
  el: '#app',
  data: {
    addedName: '',
    addedProblem: '',
    tickets: [],
  },
  created: function() {
    this.getTickets();
  },
  filters: {
    dateFormat: function(ticket) {
      let month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      let date = new Date(ticket.created_at);
      console.log(date);
      let monthName = month[date.getMonth()];
      return `${date.getDate()} ${monthName} ${date.getFullYear()}`
    },
  },
  methods: {
    getTickets: function() {
      axios.get("http://localhost:3000/api/tickets").then(response => {
	this.tickets = response.data;
	return true;
      }).catch(err => {
      });
    },
    addTicket: function() {
      axios.post("http://localhost:3000/api/tickets", {
	name: this.addedName,
	problem: this.addedProblem,
      }).then(response => {
	this.addedName = "";
	this.addedProblem = "";
	this.getTickets();
	return true;
      }).catch(err => {
      });
    },
    deleteTicket: function(ticket) {
      axios.delete("http://localhost:3000/api/tickets/" + ticket.id).then(response => {
	this.getTickets();
	return true;
      }).catch(err => {
      });
    },
  }
});
```

Notice that we are using a new piece of Vue here, a filter. We call it in the HTML with `ticket | dateFormat`. This lets us
easily format a portion of our data.

The CSS is in `public/styles.css`:

```
body {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    padding: 20px 100px 0px 100px;
    background: #f3f3f3;
}

textarea {
    width: 100%;
    max-width: 500px;
    height: 100px;
}

input, textarea, select, button {
    font-family: 'Montserrat', sans-serif;
    font-size: 1em;
}

.ticket {
    display: flex;
}

.problem {
    flex: 5;
}

.delete {
    flex: 1;
}
```

You should now have a working ticket application that persists its data in a database.

## Use a migration to update the database schema

Whenever you want to change existing database tables, you can use a migration to safely add
the new columns. In this case, we'd like to add a priority for each ticket.

### Creating a migration

Start by using knex to create a migration:

```
npx knex migrate:make tickets
```

Edit the created file and add the following:

```
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tickets', function(table) {
      table.integer('priority').defaultTo(0);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('tickets', function(table) {
      table.dropColumn('priority');
    }),
  ]);
};
```

This instructs knex to add a column called `priority` in the `tickets` table. We drop the column if
we roll back the migration. Note how we set the new row to, by default, have a priority of zero.

Next we migrate to the latest version of the table:

```
npx knex migrate:latest
```

To check that our database has been modified as desired, we can do the following on the command
line. If you use a GUI to manage the database, the commands will be different.

```
mysql -u root -p
MariaDB [(none)]> use tickets;
MariaDB [tickets]> describe tickets;
MariaDB [tickets]> quit
```

### Update the server

We now need to update `server.js` to use this new field. We modify the POST endpoint:

```
app.post('/api/tickets', (req, res) => {
  db('tickets').insert({name:req.body.name, problem: req.body.problem, priority: req.body.priority, created_at: new Date()}).then(ticket => {
    res.status(200).json({id:ticket[0]});
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error });
  });
});
```

### Update the front end

Now update the front end. Modify `index.html` so it reads:

```
	  <div class="problem">
	    <p>Problem: {{ticket.problem}}</p>
	    <p>Priority: {{ticket.priority | priorityName }}</p>
	    <p>Reported by: {{ticket.name}}</p>
	    <p>Reported on: {{ticket | dateFormat }}</p>
	  </div>
```

Update `script.js` so it contains a new filter function:

```
    priorityName: function(priority) {
      let name = new Array();
      name[0] = "High";
      name[1] = "Medium";
      name[2] = "Low";
      return name[priority];
    }
```

Now update `index.html` so it contains a select input to choose the priority in the form:

```
      <form v-on:submit.prevent="addTicket">
	<input v-model="addedName" placeholder="Name">
	<select v-model="addedPriority">
	  <option value="" selected disabled hidden>Choose a Priority</option>
	  <option value="0">High</option>
	  <option value="1">Medium</option>
	  <option value="2">Low</option>
	</select>
	<br/>
	<textarea v-model="addedProblem" placeholder="Problem"></textarea>
	<button type="submit">Submit</button>
      </form>
```

In `script.js, modify `data` so it contains a new field:

```
  data: {
    addedName: '',
    addedProblem: '',
    addedPriority: '',
    tickets: [],
  },
```

Also in `script.js`, modify `getTicket` to send the priority field:

```
    addTicket: function() {
      axios.post("http://localhost:3000/api/tickets", {
	name: this.addedName,
	problem: this.addedProblem,
	priority: this.addedPriority
      }).then(response => {
	this.addedName = "";
	this.addedProblem = "";
	this.addedPriority = "";
	this.getTickets();
	return true;
      }).catch(err => {
      });
    },
```

You should now have a working application that uses the added priority field.
