import Vue from 'vue'
import Router from 'vue-router'
import Todo from '@/components/Todo'
import Graph from '@/components/Graph'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Todo',
      component: Todo
    },
    {
      path: '/graph',
      name: 'Graph',
      component: Graph
    }
  ]
})
