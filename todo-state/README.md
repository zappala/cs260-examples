# Using state with the todo list

This activity will illustrate how to use [Vuex](https://vuex.vuejs.org/en/) to manage state for a
Vue web application that uses multiple pages and components. We're building on the [previous
activity](https://github.com/zappala/cs260-examples/tree/master/todo-graph), so you should complete
that one first.

The Vue guide includes a useful image that shows the basic idea behind state management in a Vue
application:

![state](todo-state/images/state.png)

We will setup a store to manage state, and require that all changes to state be made through methods
defined on the store. This state can then be read by all components, again using methods defined by
the store.

## Setup

First, be sure you have all the code from the previous activity. Next, install Vuex:

```
npm install vuex
```

## Store

To use the VueX, we will define the data store in `src/store.js`:

```
import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [],
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  }
});
```

To understand this it is helpful to see how the Vuex architecture works:

![vuex](todo-state/images/vuex.png)

Vue components will modify the data in the store by dispatching an action, such as `addItem`.  This
function will commit a change to the store using a mutation, such as `setItems`. This updates the
state, which components read using getters, such as `items`. By doing so, they will automatically
update whenever this state changes.

Let's start by adding state:

```
  state: {
    items: [],
  },
```

Notice how we'll be moving our Array representation of the items to the data store.

We'll next add a getter:

```
  getters: {
    items: state => state.items,
  },
```

This will allow any component to use the store to get the data:

```
this.$store.getters.items;
```

Now we'll add a mutation:

```
  mutations: {
    setItems (state, items) {
      state.items = items;
    },
  },
```

We will use mutations only internally and have all components use actions to change the data
in the store. So let's add some actions:

```
    getItems(context) {
      console.log("getting items");
      axios.get("/api/items").then(response => {
	context.commit('setItems', response.data);
	return true;
      }).catch(err => {
      });
    },
    addItem(context, item) {
      axios.post("/api/items", item).then(response => {
	return context.dispatch('getItems');
      }).catch(err => {
      });
    },
    updateItem(context, item) {
      axios.put("/api/items/" + item.id, item).then(response => {
	return true;
      }).catch(err => {
      });
    },
    deleteItem(context, item) {
      axios.delete("/api/items/" + item.id).then(response => {
	return context.dispatch('getItems');
      }).catch(err => {
      });
    }
```

We can call these methods from a component by calling, for example:

```
this.$store.dispatch('getItems');
this.$store.dispatch('addItem',{
  text: this.text,
  completed: false,
});
```

## Configuring the store

To use the store, we will modify `src/main.js`:

```
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
```

Note the two lines added here.n

## Using the store in Todo.vue, Part 1

We'll now modify our todo list to use the store instead of directly calling the back end.

First, **remove** the following lines (denoted by the minus signs) from `src/components/Todo.vue`:

```
 <script>
- import axios from 'axios';
  export default {
    name: 'Todo',
    data () {
      return {
-       items: [],
        text: '',
        show: 'all',
        drag: {},
      }
    },
```

Next, **add** the following lines (denoted by the plus signs) to `src/components/Todo.vue`:

```
    computed: {
+     items: function() {
+       return this.$store.getters.items;
+     },
```

This makes `items` a computed property, which we get from the Vuex store.

Next, modify `getItems` in the same file as follows:

```
      getItems: function() {
-       axios.get("/api/items").then(response => {
-        this.items = response.data;
-        return true;
-       }).catch(err => {
-       });
+       this.$store.dispatch('getItems');
     },
```

And modify `addItem` as follows:

```
      addItem: function() {
-       axios.post("/api/items", {
+       this.$store.dispatch('addItem',{
         text: this.text,
         completed: false
-       }).then(response => {
-        this.text = "";
-        this.getItems();
-        return true;
-       }).catch(err => {
        });
      },
```

These changes will make it so that we use the store to get and add items, but not to update or
delete them. The app will work! We'll just have some "rogue" code that goes directly to the back end
instead of using the Vuex store.

## Using the store in Todo.vue, Part 2

Let's go ahead and finish our modifications. Modify `completeItem` as follows:

```
      completeItem: function(item) {
-       axios.put("/api/items/" + item.id, {
+       this.$store.dispatch('updateItem',{
+        id: item.id,
         text: item.text,
         completed: !item.completed,
         orderChange: false,
-       }).then(response => {
-        return true;
-       }).catch(err => {
        });
      },
```

Note that we need to add the item id when we update it. With axios, we send the id in the URL, but
with the store we are dispatching using a function, not a URL.

Now modify `deleteItem` as follows:

```
      deleteItem: function(item) {
-       axios.delete("/api/items/" + item.id).then(response => {
-        this.getItems();
-        return true;
-       }).catch(err => {
+       this.$store.dispatch('deleteItem',{
+        id: item.id
        });
      },

Finally, modify `dropItem`:

```
      dropItem: function(item) {
-       axios.put("/api/items/" + this.drag.id, {
+       this.$store.dispatch('updateItem',{
+        id: this.drag.id,
         text: this.drag.text,
         completed: this.drag.completed,
         orderChange: true,
         orderTarget: item.id
-       }).then(response => {
-        this.getItems();
-        return true;
-       }).catch(err => {
        });
      },
```

We now have the Todo.vue component entirely using the store for its interactions with the todo list,
and the store handles all communication with the back end.

## Using the store in Graph.vue

The first step is to remove a few lines, like we did with the todo component. In
`src/components/Graph.vue`, delete the following lines:

```
 <script>
- import axios from 'axios';
  import BarChart from './BarChart.js';
  export default {
    components: {BarChart},
    name: 'Graph',
    data () {
      return {
-       items: [],
        monthText: '1',
        options: {
```

Add the following computed property, as we did before:

```
   computed: {
+     items: function() {
+       return this.$store.getters.items;
+     },
```

Finally, modify `getItems`:

```
     getItems: function() {
-       axios.get("/api/items").then(response => {
-        this.items = response.data;
-        return true;
-       }).catch(err => {
-       });
+       this.$store.dispatch('getItems');
      },
```

We have now modified the entire application to use the Vuex store. Note, the *functionality* of the
application hasn't changed, just the *architecture*. This change structures our code so that all
interaction with shared data and the back end occur in one place. This will be particularly helpful
as you build more complex web applications.
