var app = new Vue({
  el: '#app',
  data: {
    todos: [],
    message: '',
    show: 'all',
    drag: {},
  },
  computed: {
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
    }
  },
  methods: {
    addItem: function() {
      console.log("addTodo");
      this.todos.push({text: this.message,completed:false});
      this.message = '';
    },
    deleteItem: function(todo) {
      var index = this.todos.indexOf(todo);
      if (index > -1)
	this.todos.splice(index,1);
    },
    completeItem: function(todo) {
      todo.completed = !todo.completed;
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
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      var indexItem = this.todos.indexOf(this.drag);
      var indexTarget = this.todos.indexOf(item);
      this.todos.splice(indexItem,1);
      this.todos.splice(indexTarget,0,this.drag);
      
      console.log('Looks like you dropped ',this.drag.text,' onto ',item.text);
    }
  }
});
