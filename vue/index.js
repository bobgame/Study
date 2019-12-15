const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
const app2 = new Vue({
  el: '#app-2',
  data: {
    message: `页面加载与 ${new Date().toLocaleString()}`
  }
})
const app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
})

Vue.component('todo-item', {
  props: ['todo'],
  template: `
        <li>
          {{todo.text}}
        </li>
      `
})
const app4 = new Vue({
  el: '#app-4',
  data: {
    todos: [
      {id: 0, text: 'AAAAAAA'},
      {id: 1, text: 'BBBBBB'},
      {id: 2, text: 'CCC'},
      {id: 3, text: 'DD'},
    ]
  }
})
const app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello user!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
const app6 = new Vue({
  el: '#app-6',
  data: {
    message: 'Hello user!'
  }
})
