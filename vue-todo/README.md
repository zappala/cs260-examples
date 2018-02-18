# Vue Todo List

This is a simple todo list application built using [Vue](https://vuejs.org/).

To learn how this is built, clone this repository, then remove all
the code in `index.html` and `script.js`.

Inside your cloned repository, start up a Python server to view the
site in your browser:

```
python -m SimpleHTTPServer
```

You can navigate to `localhost:8000` to see the site.

## A static list

Start with this in `index.html`:

```
<!DOCTYPE html>
<html>
  <head>
    <link href="https://fonts.googleapis.com/css?family=Arvo" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css"/>
    <title>Vue Todo</title>
  </head>
  <body>
    <div id="app">
      <h1>A List of Things To Do</h1>
      <ul>
	<li v-for="item in todos">
	  <label>{{ item.text }}</label>
	</li>
      </ul>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="/script.js"></script>
  </body>
</html>
```

And this in `scripts.js`:

```
var app = new Vue({
  el: '#app',
  data: {
    todos: [{text: "make an app"},{text: "declare victory"},{text: "profit"}],
  },
});
```

You should see a list of three things to do, with a style applied to the list to remove the bullets,
add a background, increase spacing, and add some width.

Recall from the [Vue.js Guide](https://vuejs.org/v2/guide/) that we
have setup `script.js` to create a Vue instance. It runs inside the
`#app` div, and it provides some data in the `todos` variable.

Inside `index.html`, we use `v-for` to loop through each of the items in the `todos` variable, assign
the item to a variable, and then display the text of the item using the handlebars syntax.

You can open the console and modify the `todos` array to see how data
binding works in Vue:

```
app.todos.push({text:'Success'});
```

## A dynamic list

Displaying a static list is not very useful, and modifying the list in
the console is painful, so let's create a dynamic list.

In `index.html`, add the following right after the `h1` tag:

```
      <form v-on:submit.prevent="addItem">
	<input type="text" v-model="message">
	<button type="submit">Add</button>
      </form>
```

This creates a form using standard HTML, with some Vue attributes
added in.

1. We use `v-on` to tell Vue that when it sees a submit event for the
form, it should call the `addItem` method. The addition of `.prevent`
to the submit event will prevent the standard browser behavior that
submits the form to the server and causes the page to reload.

1. We use `v-model` to bind the text input to a variable called
`message` that Vue will supply.

To make this work, modify the Vue data in `script.js` to read:

```
  data: {
    todos: [],
    message: '',
  },
```

This removes the static list of items and creates the new variable,
message, that is bound to the form input.

Next, add the following after the `data` declaration in `script.js`:

```
  methods: {
    addItem: function() {
      this.todos.push({text: this.message,completed:false});
      this.message = '';
    },
  }
```

This adds set of methods that Vue will export, in addition to the
data. The `addItem` method uses what is stored in `message` to create
a new item object and add it to the `todos` array. Note that we also
create a new property on the object, `completed`, which we will use later.

The `message` variable has a two-way binding, so if you type something
into the form input, the variable is automatically updated with the
new content. Likewise, if you modify the content of the variable in
JavaScript, the change is automatically shown in the input on the
screen.

You should now be able to use the form input to add items to the list.

## Completing items

It's not much good having a todo list unless we can check items off the list.
Modify your `index.html` so that a check box displays in front of each item:

```
	  <input type="checkbox" v-model="item.completed" v-on:click="completeItem(item)" /><label v-bind:class="{ completed: item.completed }">{{ item.text }}</label>
```

This creates a standard HTML check box input, with two Vue
attributes. We also add an attribute to the label.

1. We use `v-model` to connect the value of the input (whether the box
is checked) to the `completed` property on the item object. This way,
when we need to redraw the list, the box will only be checked if the
item is actually completed.

1. We use `v-on` to tell Vue that if the click event is triggered for
the check box, it should call the `completeItem` method and pass this
method the item object.

1. We use `v-bind` to tell Vue that the class attribute should incude
a `completed` class that is bound to the value of `completed` on the
item property. If you look in `style.css`, you will see that the
`completed` class will make the item appear crossed out.

To make this work, add another method in `script.js`, after `addItem`:

```
    completeItem: function(todo) {
      todo.completed = !todo.completed;
    },
```

This method simply toggles the boolean `completed` property on the item.

You should now be able to check items off your list and have them show
as crossed out when they are completed.

## Deleting items

It's great to check off items, but sometimes you want to delete items
off your list. Let's add a delete button next to each item in `index.html`:

```
	  <input type="checkbox" v-model="item.completed" v-on:click="completeItem(item)" /><label v-bind:class="{ completed: item.completed }">{{ item.text }}</label><button v-on:click="deleteItem(item)" class="delete">X</button>
```

This uses a standard button element, with the `v-on` attribute that
tells Vue to call the `deleteItem` method when the click event is
triggered for the button. We pass the current `item` to this method.

To make this work, add another method in `script.js`, after `completeItem`:

```
    deleteItem: function(item) {
      var index = this.todos.indexOf(item);
      if (index > -1)
	this.todos.splice(index,1);
    },
```

This method simply deletes the item from the `todos` array.

Notice that the delete button only shows up when we hover over an
item. This is done in CSS; see if you can find the relevant styles in
`styles.css`.

You should now be able to delete items from your list.

## A happy message

Everyone feels good when their todo list is empty. So let's add a message
that displays when the list is empty. Put this right after the `h1` tag
in `index.html`:

```
      <p v-show="activeTodos.length === 0">You are done with all your tasks! Good job!</p>
```

To make this work, we need to add a [computed
property](https://vuejs.org/v2/guide/computed.html), which we will use
to compute the subset of todo items that are active (not yet
completed).  You should put this in between the `data` and the
`methods`:

```
  computed: {
    activeTodos: function() {
      return this.todos.filter(function(item) {
	return !item.completed;
      });
    },
```

The computed property is called `activeTodos`. In this computed
property, we filter the todo list to return only the items that are
not completed.  This property is cached and recomputed based on its
dependencies, which in this case is the todo list. Every time this
changes, the function is re-evaluated.

You should now be able to show a message if you have no active tasks.

## More buttons

It might be helpful to display a subset of the items, such as only those that
are completed, or only those that are *not* completed. We might also like to
delete all the completed items at once.

Add some buttons to `index.html` that handle these actions, right between the `form` and
the `ol`.

```
      <div class="controls" v-if="filteredTodos.length !== 0">
	<button v-on:click="showAll()">Show All</button>
	<button v-on:click="showActive()">Show Active</button>
	<button v-on:click="showCompleted()">Show Completed</button>
	<button v-on:click="deleteCompleted()">Delete Completed</button>
      </div>
```

In addition, change the `li` tag so it looks like this:

```
	<li v-for="item in filteredTodos">
```

We have the following additions:

1. A button that, when we click it, calls the `showAll` method.
1. A button that, when we click it, calls the `showActive` method.
1. A button that, when we click it, calls the `showCompleted` method.
1. A button that, when we click it, calls the `deleteCompleted` method.

1. A `div` that wraps these buttons and is only shown if the
`filteredTodos` array is not empty.


We have also changed the `li` tag so it loop sover the `filteredTodos` array.

We will need to make a number of changes to `script.js`. First, add a
`show` property to the `data`, which should now read:

```
  data: {
    todos: [],
    message: '',
    show: 'all',
  },
```

For the buttons, add the following methods:

```
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
```

These are all basic methods. The first three simply change the `show` property in the `data`. The
last one filters the todo list so it contains only the items that have not been completed, which
effectively deletes the completed items.

Finally, we need to add another computed property, which we will use
to compute the subset of todo items that will be shown on the
screen. You shoud put this after the `activeTodos` computed property:

```
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
```

The computed property is called `filteredTodos`. In this computed
property, we filter the todo list based on the current state
of the `show` property.  

You should now be able to show the active, completed, or all items in
the list.  You should also be able to delete all the completed items
with one button click.

## Drag and drop

The last thing we'll do is add drag-and-drop on the list items, so you
can rearrange them. Vue integrates easily with HTML 5 dragging and
dropping.

In `index.html`, modify the `li` element so it reads:

```
	<li v-for="item in filteredTodos" draggable="true" v-on:dragstart="dragItem(item)" v-on:dragover.prevent v-on:drop="dropItem(item)">
```

This will allow the items to be dragged and dropped. The `draggable`
attribute is standard HTML 5 syntax to indicate the item can be
dropped. The `v-on:dragstart` attribute calls the `dragItem` method
when dragging starts. The `v-on:dragover` attribute prevents HTML5
from triggering an event every time the an item is dragged over
another. The `v-on:drop` attribute calls the `dropItem` method when
the item is dropped. You can see a [complete list of available
JavaScript
methods](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).

Note that the `item` passed to `dragItem` is the item being dragged,
and the `item` being dropped is the item it is being dropped
onto. Remember, the `li` tag is generated for each separate item, so these
are set to different variables.

To make this work in `script.js`, first add a `drag` property to the
`data` so it looks like this:

```
  data: {
    todos: [],
    message: '',
    show: 'all',
    drag: {},
  },
```

Then add these methods at the end of your method list:

```
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      var indexItem = this.todos.indexOf(this.drag);
      var indexTarget = this.todos.indexOf(item);
      this.todos.splice(indexItem,1);
      this.todos.splice(indexTarget,0,this.drag);
    },
```

The `dragItem` method sets the `drag` property so we can keep track of
which item is being dragged. The `dropItem` method places the dropped
item ahead of the one it is dropped onto.

You should now be able to use drag-and-drop to reorder the items in
the list. Isn't this fantastic?!

The entire `index.html` is 31 lines of code, and `script.js` is 59
lines of code.

You can examine the styles in `styles.css` to see how we made those
work.
