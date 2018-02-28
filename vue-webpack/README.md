# Vue Webpack Template

For this activity we are going to use the [Vue webpack
template](https://github.com/vuejs-templates/webpack) to demonstrate
building a Vue site that has multiple pages. The template includes
webpack, which will let us compile single-page Vue components, run a
development web server, automatically reload our code when it changes,
and bundle our code for distribution on a public web server. To handle
a site with multiple pages, we'll use [Vue
Router](https://router.vuejs.org/en/).

## Install node

To get started, we first need to install
[Node.js](https://nodejs.org/en/). We'll cover Node much more later
when we use it to build the server side of our web applications. In
addition to providing a server, Node includes a package manager,
called npm, that is very convenient and can also be used to manage
front end code.

### Use nvm

My preferred way to install node is to use
[nvm](https://github.com/creationix/nvm). This lets you install
multiple versions of node simultaneously, in case different apps need
different versions. I don't usually need this, but I prefer nvm
because it makes it easy for me to always get the latest stable
versions of node and npm. It also installs into my local directory,
rather than polluting the globally installed packages.

This works well on both Linux and MacOS.

To do this:

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

Then close your terminal, open a new one, and type:

```
nvm install stable
nvm use stable
```

You'll now be using the latest stable versions of node and npm. You will need to repeat `nvm use` each time
you open a terminal.

### Install via package manager

If you prefer, you can install using your package manager:

```
sudo apt-get install nodejs
sudo apt-get install npm
```

For Mac OS, you could use [HomeBrew](https://brew.sh/): [Install Node.js and npm using Homebrew on OS X and macOS](https://changelog.com/posts/install-node-js-with-homebrew-on-os-x).


### Install directly

If you prefer, you can also install node directly. You can visit the
[download page](https://nodejs.org/en/download/).

## Using the template

Next, you need to install vue-cli:

```
npm install -g vue-cli
```

Once this is done, you can start a new project using the webpack template:

```
vue init webpack vue-webpack
cd vue-webpack
npm install
```

As you do this, be sure to say yes to installing vue router.  Do not
bother with installing linting or testing now. We'll cover that later.
Use npm instead of yarn.

Once this finishes installing packages, you can:

```
npm run dev
```

This will transpile your code and start a webserver running on
localhost:8080

## Project Structure

When you use a template to setup a project, you are getting a lot of things done for you, and you
also are given a [project structure](http://vuejs-templates.github.io/webpack/structure.html).

Familiarize yourself with where different parts of your project
go. We'll be working with `index.html` in the top level directory, and
also the code in the `src` directory.

* `index.html` has the standard boilerplate that we've always used.

* `src/main.js` is the starting point for the JavaScript. It configures the Vue instance.

* `App.vue` is a [single file component](https://vuejs.org/v2/guide/single-file-components.html). This lets
  you put all the code for a component -- the HTML, CSS, and JavaScript -- all in one place. Webpack will
  transpile (or convert) this into code that your browser will understand. `App.vue` creates the main
  app container, includes a logo, and includes the Router, plus some CSS styles. 

* `router/index.js` contains the Vue Router configuration, listing the different paths the application will
  handle and the component used for each path.

* `components/HelloWorld.vue` is the component that shows you most of
  the content on the home page of the application.

To see how the template works, leave webpack running (from when you
typed `npm run dev`), and edit `src/components/HelloWorld.vue`.
Change "Essential Links" to say "Important Links". You will see the
browser update your code automatically.

## Creating a new home page

Edit `App.vue` to remove the Vue logo and change the styles:

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

Download a copy of [this photo](https://www.flickr.com/photos/vlad-sense/3524601149/in/photolist-6nsv8k-J2BnGs-2Vgg4E-fHfdA-bsosTp-7YfSEU-xT4ZQL-boZKjZ-bjKfwv-5gbGLA-uWGKA-mykSge-68QSHC-68LFQv-JPY9R-5uJD7S-68LBPR-jxoJPr-jFgGNS-CaXn7-6Rai4j-5U6Kc-8PfdcE-a9F8S6-aGW8rX-4DLchC-8NJaWL-y39Fe-ootqFu-deLGQ6-7QgCE-6RqvEs-dmAssB-g5dU2x-bQd3sc-cn8e1j-a34PNQ-dua9xU-4yvJ7u-4Hz5j2-dKaXQo-dKaNK9-pcBYtw-dXQHbB-hSD3ch-dKaFty-89RgDG-dKb6qh-6qwEGL-dKaERQ) and put it in `static/images/cloud.jpg`.

Create a new component in `components/HomePage.vue` that contains:

```
<template>
    <div class="hero">
	<h1>Simplify Your Life</h1>
	<img v-bind:src="imagePath"/>
    </div>
</template>

<script>
 export default {
     name: 'HomePage',
     data () {
	 return {
	     imagePath: '/static/images/cloud.jpg'
	 }
     }
 }
</script>

<style scoped>
 body {
     padding: 0px;
     margin: 0px;
 }
 .hero {
     text-align: center;
 }
 h1 {
     font-size: 2.5em;
     letter-spacing: .2rem;
     color: #999;
     margin-bottom: 2px;
 }
 img {
     width: 100%;
 }
</style>
```

Edit `src/router/index.js` to use this new component:

```
import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    }
  ]
})
```


Edit index.html:

```
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet">
    <title>Vue Todo</title>
  </head>
```

## Add another page

Download [this image](https://upload.wikimedia.org/wikipedia/commons/d/d9/Roadrunner_DeathValley.jpg) and
put it in `static/images/road-runner.jpg`.


Create a file called `components/Profile.vue` that contains:

```
<template>
  <div>
    <h1>Profile</h1>
    <h2>{{ name }}</h2>
    <img v-bind:src="imagePath"/>
  </div>
</template>

<script>
 export default {
   name: 'Profile',
   data () {
     return {
       name: 'Road Runner',
       imagePath: '/static/images/road-runner.jpg'
     }
   }
 }
</script>

<style scoped>
 img {
     max-width: 500px;
 }
</style>
```

Edit `router/index.js` to include this path:

```
    routes: [
	{
	    path: '/',
	    name: 'HomePage',
	    component: HomePage
	},
	{
	    path: '/profile',
	    name: 'Profile',
	    component: Profile
	}

    ]
```

Be sure to import `Profile` as you did `HomePage` at the top:

```
import Profile from '@/components/Profile'
```

Now you can visit `http://localhost:8080/#/profile` to see this page.

## Add a menu

Create a file in `components/AppHeader.vue` that contains:

```
<template>
    <nav>
	<label for="show-menu" class="show-menu">Show Menu</label>
	<input type="checkbox" id="show-menu" role="button">
        <ul id="menu">
	    <li><router-link to="/">Home</router-link></li>
	    <li><router-link to="/profile">Profile</router-link></li>
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
 /*Style 'show menu' label button and hide it by default*/
 .show-menu {
     text-decoration: none;
     color: #fff;
     background: #FF5035;
     text-align: center;
     padding: 10px 0;
     display: none;
 }
 /*Hide checkbox*/
 input[type=checkbox]{
     display: none;
 }
 /*Show menu when invisible checkbox is checked*/
 input[type=checkbox]:checked ~ #menu{
     display: block;
 }
</style>
```


Modify `App.vue` so it contains:

```
<template>
    <div id="app">
	<app-header></app-header>
	<router-view/>
    </div>
</template>

<script>
 import AppHeader from './components/AppHeader.vue'
 export default {
     name: 'App',
     components: { AppHeader }
 }
</script>
```

## Add a todo list

Create a new component in `components/Todo.vue`:

```
<template>
  <div class="todo">
    <h1>A List of Things To Do</h1>
    <p v-show="activeTodos.length === 0">You are done with all your tasks! Good job!</p>
    <form v-on:submit.prevent="addItem">
      <input type="text" v-model="message">
      <button type="submit">Add</button>
    </form>
    <div class="controls">
      <button v-on:click="showAll()">Show All</button>
      <button v-on:click="showActive()">Show Active</button>
      <button v-on:click="showCompleted()">Show Completed</button>
      <button v-on:click="deleteCompleted()">Delete Completed</button>
    </div>
    <ul>
      <li v-for="item in filteredTodos" draggable="true" v-on:dragstart="dragItem(item,$event)" v-on:dragover.prevent v-on:drop="dropItem(item)">
	<input type="checkbox" v-model="item.completed" v-on:click="completeItem(item)" /><label v-bind:class="{ completed: item.completed }">{{ item.text }}</label><button v-on:click="deleteItem(item)" class="delete">X</button>
      </li>
    </ul>
  </div>
</template>

<script>
 export default {
   name: 'Todo',
   data () {
     return {
       todos: [],
       message: '',
       show: 'all',
       drag: {},
     }
   },
   computed: {
     activeTodos: function() {
       return this.todos.filter(function(item) {
	 return !item.completed;
       });
     },
     filteredTodos: function() {
       if (this.show === 'active')
	 return this.todos.filter(function(item) {
	   return !item.completed;
	 });
       if (this.show === 'completed')
	 return this.todos.filter(function(item) {
	   return item.completed;
	 });
       return this.todos;
     },
   },
   methods: {
     addItem: function() {
       this.todos.push({text: this.message,completed:false});
       this.message = '';
     },
     completeItem: function(item) {
       item.completed = !item.completed;
     },
     deleteItem: function(item) {
       var index = this.todos.indexOf(item);
       if (index > -1)
	 this.todos.splice(index,1);
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
       this.todos = this.todos.filter(function(item) {
	 return !item.completed;
       });
     },
     dragItem: function(item,event) {
       this.drag = item;
       event.dataTransfer.setData('text', '');
     },
     dropItem: function(item) {
       var indexItem = this.todos.indexOf(this.drag);
       var indexTarget = this.todos.indexOf(item);
       this.todos.splice(indexItem,1);
       this.todos.splice(indexTarget,0,this.drag);
     },
   }
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

Modify `router/index.js`:

```
    routes: [
	{
	    path: '/',
	    name: 'HomePage',
	    component: HomePage
	},
	{
	    path: '/profile',
	    name: 'Profile',
	    component: Profile
	},
	{
	    path: '/todo',
	    name: 'Todo',
	    component: Todo
	}

    ]
```

Be sure to import `Todo` as you did `HomePage` at the top:

```
import Todo from '@/components/Todo'
```

Modify the menu in `components/AppHeader.vue`:

```
    <nav>
	<label for="show-menu" class="show-menu">Show Menu</label>
	<input type="checkbox" id="show-menu" role="button">
        <ul id="menu">
	    <li><router-link to="/">Home</router-link></li>
	    <li><router-link to="/todo">Todo</router-link></li>
	    <li><router-link to="/profile">Profile</router-link></li>
	</ul>	
    </nav>
```
