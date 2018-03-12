# Graphing data from a todo list

This activity will illustrate how to add another page to the Todo List
app that graphs the number of completed tasks per day. Doing this
requires sharing data (the todo list) between two different pages. For
this activity, we'll simply request the data through the API on the
Node server. In a later activity, we'll show you how to setup shared
data storage on the client, which will reduce the number of API calls
needed and provide better structure for the application.

## Setup

First, start a new project using the webpack template:

```
vue init webpack todo-graph
cd todo-graph
```

As you do this, be sure to say yes to installing vue router.  Do not
bother with installing linting or testing now. We'll cover that later.
Use npm instead of yarn.

Next, we are going to setup webpack so that it can run both the front
end and the back end. When you use `npm run dev`, this runs a development
web server on port 8080 with your front end code. By making the change
below, the development sever will forward certain URLs to your back end
server, which will run on port 3000.

In `config/index.js`, modify the `dev` property to include:


```
    proxyTable: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false
      }
    },
```

This will tell the webpack development server (running on port 8080)
to send API requests (for URLs starting with /api) to your Node server
(running on port 3000).

Now install the axios library that we want to use for Ajax requests:

```
npm install axios
```

## Home Page

We are going to setup the home page of the application to run the todo list
application we built earlier. This code should all be familiar to you.

### Index.html

Edit `index.html` to change the title and load a Google font:

```
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet">
    <title>Vue Todo</title>
  </head>  
```

### App.vue

Edit `src/App.vue` to remove the Vue logo and change the styles:

```
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
    font-size: 16px;
    padding: 20px 100px 0px 100px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
```

### Todo.vue

Create `src/components/Todo.vue`:

```
<template>
  <div class="todo">
    <h1>A List of Things To Do</h1>
    <form v-on:submit.prevent="addItem">
      <input type="text" v-model="text">
      <button type="submit">Add</button>
    </form>
    <div class="controls">
      <button v-on:click="showAll()">Show All</button>
      <button v-on:click="showActive()">Show Active</button>
      <button v-on:click="showCompleted()">Show Completed</button>
      <button v-on:click="deleteCompleted()">Delete Completed</button>
    </div>
    <ul>
      <li v-for="item in filteredItems" draggable="true" v-on:dragstart="dragItem(item)" v-on:dragover.prevent v-on:drop="dropItem(item)">
	<input type="checkbox" v-model="item.completed" v-on:click="completeItem(item)" /><label v-bind:class="{ completed: item.completed }">{{ item.text }}</label><button v-on:click="deleteItem(item)" class="delete">X</button>
      </li>
    </ul>
  </div>
</template>

<script>
 import axios from 'axios';
 export default {
   name: 'Todo',
   data () {
     return {
       items: [],
       text: '',
       show: 'all',
       drag: {},
     }
   },
   computed: {
     activeItems: function() {
       return this.items.filter(function(item) {
	 return !item.completed;
       });
     },
     filteredItems: function() {
       if (this.show === 'active')
	 return this.items.filter(function(item) {
	   return !item.completed;
	 });
       if (this.show === 'completed')
	 return this.items.filter(function(item) {
	   return item.completed;
	 });
       return this.items;
     },
   },
   created: function() {
     this.getItems();
   },
   methods: {
     getItems: function() {
       axios.get("/api/items").then(response => {
	 this.items = response.data;
	 return true;
       }).catch(err => {
       });
     },
     addItem: function() {
       axios.post("/api/items", {
	 text: this.text,
	 completed: false
       }).then(response => {
	 this.text = "";
	 this.getItems();
	 return true;
       }).catch(err => {
       });
     },
     completeItem: function(item) {
       axios.put("/api/items/" + item.id, {
	 text: item.text,
	 completed: !item.completed,
	 orderChange: false,
       }).then(response => {
	 return true;
       }).catch(err => {
       });
     },
     deleteItem: function(item) {
       axios.delete("/api/items/" + item.id).then(response => {
	 this.getItems();
	 return true;
       }).catch(err => {
       });
     },
     showAll: function() {
       this.show = 'all';
     },
     showActive: function() {
       this.show = 'active';
     },
     showCompleted: function() {
       this.show = 'completed';
     },
     deleteCompleted: function() {
       this.items.forEach(item => {
	 if (item.completed)
	   this.deleteItem(item)
       });
     },
     dragItem: function(item) {
       this.drag = item;
     },
     dropItem: function(item) {
       axios.put("/api/items/" + this.drag.id, {
	 text: this.drag.text,
	 completed: this.drag.completed,
	 orderChange: true,
	 orderTarget: item.id
       }).then(response => {
	 this.getItems();
	 return true;
       }).catch(err => {
       });
     },
   }
</script>

<style scoped>
 ul {
     list-style: none;
 }

 li {
     background: #f3f3f3;
     width: 500px;
     min-height: 30px;
     padding: 10px;
     margin-bottom: 10px;
     font-size: 1em;
     display: flex;
     align-items: center;
 }

 .delete {
     display: none;
     margin-left: auto;
 }

 li:hover .delete {
     display: block;
 }

 label {
     width: 400px;
 }

 .completed {
     text-decoration: line-through;
 }

 /* Form */

 input[type=checkbox] {
     transform: scale(1.5);
     margin-right: 10px;
 }

 input[type=text] {
     font-size: 1em;
 }

 button {
     font-family: 'Arvo';
     font-size: 1em;
 }
 .controls {
     margin-top: 20px;
 }
</style>
```

**Notice the import statement for axios. This will let this component use the axios library. Webpack
will automatically bundle it for us.**

### index.js (routing)

Edit `src/router/index.js`:

```
import Vue from 'vue'
import Router from 'vue-router'
import Todo from '@/components/Todo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Todo',
      component: Todo
    }
  ]
})
```

## Back End

On the back end, we'll use a Node server. Put the following into `server.js`:

```
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'))


let items = [];
let id = 0;

app.get('/api/items', (req, res) => {
  res.send(items);
});

app.put('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = items[index];
  item.completed = req.body.completed;
  item.text = req.body.text;
  // handle drag and drop re-ordering
  if (req.body.orderChange) {
    let indexTarget = itemsMap.indexOf(req.body.orderTarget);
    items.splice(index,1);
    items.splice(indexTarget,0,item);
  }
  res.send(item);
});

app.post('/api/items', (req, res) => {
  id = id + 1;
  let item = {id:id, text:req.body.text, completed: req.body.completed};
  items.push(item);
  res.send(item);
});

app.delete('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
```

You can now run the back end server in one terminal with:

```
node server.js
```

Then run the front end server with:

```
npm run dev
```

You should now be able to use the todo list application by visiting `localhost:8080`.

## Random Data

Next, we're going to setup the server to have some random data in the todo list, so that
the graph will have some meaningful data. Add the following to `server.js`, right before your
endpoints:

```
// setup some random data
let doImport = true;
let importItems = [];
let importId = 0;

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function createRandomData() {
  const DAYS = 29;
  for (let day = 1; day < DAYS; day++ ) {
    let number = randomIntFromInterval(0,30);
    for (let i = 0; i < number; i++ ) {
      importId += 1;
      let date = new Date(2018,1,day);
      let item = {id:importId, text:"random thing", completed: true, completedDate: date };
      importItems.push(item);
    }
  }
}

if (doImport) {
  createRandomData();
  items = importItems;
  id = importId;
}
```

If you restart the server, you should now have a bunch of completed items.

## Graph

For graphing, we're going to use
[vue-chartjs](http://vue-chartjs.org/). This is built on
[Chart.js](http://www.chartjs.org/). If you would like additional
practice with this library, visit this [good
tutorial](https://hackernoon.com/lets-build-a-web-app-with-vue-chart-js-and-an-api-544eb81c4b44).

To add graphing, first install the following software:

```
npm install vue-chartjs chart.js
```

Then, in `src/components/BarChart.js`, add the following component:

```
import {HorizontalBar, mixins} from 'vue-chartjs';
const { reactiveProp } = mixins

export default {
    extends: HorizontalBar,
    mixins: [reactiveProp],
    props: ['options'],
    mounted () {
	this.renderChart(this.chartData, this.options)
    }
}
```

Note, this is a plain JavaScript component, not a Vue single page component.

Then, add the following component in `src/components/Graph.vue`:

```
<template>
  <div>
    <select v-model="monthText" name="month">
	<option value="0">January</option>
	<option value="1">February</option>
	<option value="2">March</option>
	<option value="3">April</option>
	<option value="4">May</option>
	<option value="5">June</option>
	<option value="6">July</option>
	<option value="7">August</option>
	<option value="8">September</option>
	<option value="9">October</option>
	<option value="10">November</option>
	<option value="11">December</option>
    </select>
    <input
    <div class="graph">
      <bar-chart v-if="chartData" :chart-data="chartData" :options="options" />
    </div>
  </div>
</template>

<script>
 import axios from 'axios';
 import BarChart from './BarChart.js';
 export default {
   components: {BarChart},
   name: 'Graph',
   data () {
     return {
       items: [],
       monthText: '1',
       options: {
	 responsive: true,
	 maintainAspectRatio: true,
	 scales: {
	   yAxes: [{
	     barPercentage:0.5,
	   }],
	 }
       },
     }
   },
   created: function() {
     this.getItems();
   },
   computed: {
     month: function() {
       return parseInt(this.monthText);
     },
     chartData: function() {
       let labels = [];
       let data = [];
       // sort by date
       this.items.sort(function(a,b) {
	 return b.completedDate - a.completedDate;
       });
       // setup data
       let completedCounts = {}
       for (let day = 1; day < 32; day++ ) {
	 completedCounts[day] = 0;
       }
       this.items.forEach(item => {
	 let day = new Date(item.completedDate).getDate();
	 let month = new Date(item.completedDate).getMonth();
	 console.log(month, this.month);
	 if (month === this.month && item.completed)
	   completedCounts[day] += 1;
       });
       for (let day in completedCounts) {
	 labels.push(day.toString());
	 data.push(completedCounts[day]);
       };
       return {
	 labels:labels,
	 datasets: [
	   {
	     label: 'Completed Tasks per Day',
	     backgroundColor: '#f87979',
	     data: data,
	   }
	 ]
       }
     },
   },
   methods: {
     getItems: function() {
       axios.get("/api/items").then(response => {
	 this.items = response.data;
	 return true;
       }).catch(err => {
       });
     },
     setMonth: function(event) {
       this.month = event;
       console.log(this.month);
     }
   }
 }
</script>

<style scoped>
 .graph {
     position: relative;
     width: 800px;
 }
</style>

```

You should now be able to visit `http://localhost:8080/#/graph` and see a beautiful graph.

## Menu

To navigate between these pages, we'll add a menu. Add the following to `src/components/AppHeader.vue`:

```
<template>
  <nav>
    <ul id="menu">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/graph">Graph</router-link></li>
    </ul>	
  </nav>
</template>

<script>
 export default {
   name: 'AppHeader'
 }
</script>

<style scoped>
 /*Strip the ul of padding and list styling*/
 .clear {
     float: clear;
 }
 nav {
     display: grid;
 }
 ul {
     list-style-type:none;
     margin:0;
     padding:0;
 }

 /*Create a horizontal list with spacing*/
 li {
     display:inline-block;
     float: left;
     margin-right: 1px;
 }
 /*Style for menu links*/
 li a {
     display:block;
     margin-right: 20px;
     height: 50px;
     text-align: center;
     line-height: 50px;
     color: #666;
 }
 /*Active color*/
 li a.active {
 }
 /*Hover state for top level links*/
 li:hover a {
 }
</style>
```

Then modify `src/App.vue` so that it uses the menu:

```
<template>
  <div id="app">
    <app-header/>
    <router-view/>
  </div>
</template>

<script>
 import AppHeader from './components/AppHeader';
 export default {
   name: 'App',
   components: { AppHeader }
 }
</script>
```

## Closing Note

You will notice that I have provided all the necessary code for this
application. You could build it yourself (following the above
instructions) or do the following to simply use the code I have. This
is a good illustration of how to share code that uses Node and webpack.

```
cd todo-graph
npm install

# in one terminal
node server.js

# in another terminal
npm run dev
```
