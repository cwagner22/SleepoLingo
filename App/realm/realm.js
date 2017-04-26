'use strict'

import Realm from 'realm'

class Todo extends Realm.Object {}
Todo.schema = {
  name: 'Todo',
  properties: {
    done: {type: 'bool', default: false},
    text: 'string'
  }
}

class TodoList extends Realm.Object {}
TodoList.schema = {
  name: 'TodoList',
  properties: {
    name: 'string',
    creationDate: 'date',
    items: {type: 'list', objectType: 'Todo'}
  }
}

export default new Realm({schema: [Todo, TodoList]})
