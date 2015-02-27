var assign = require('object-assign');
var Reflux = require('reflux');
var crud = require('./crud');
var c = require('./constants');
var actions = require('./actions');


var clientId = +(new Date());


var tasks = Reflux.createStore({

  listenables: actions.task,

  onLog(task) {
    task.id = clientId++;  // aah... this is mutating the main task woo js
    crud.create(this.data, task)(this.crudResult());
  },

  onLogFailedValidation(task, errors) {
    console.warn('task failed validation :(', task, errors);
  },

  onBeginEdit(taskId) {
    var task = crud.get(this.data, taskId).expect(c.NOT_FOUND);  // throws if no task
    var editingTask = assign({}, task, {editing: true});
    crud.update(this.data, taskId, editingTask)(this.crudResult());
  },

  onCancelEdit(taskId) {
    var task = crud.get(this.data, taskId).expect(c.NOT_FOUND);  // throws if no task
    var editingTask = assign({}, task, {editing: false});
    crud.update(this.data, taskId, editingTask)(this.crudResult());
  },

  onUpdate(taskId, task) {
    crud.update(this.data, taskId, task)(this.crudResult());
  },

  onRemove(taskId) {
    crud.del(this.data, taskId)(this.crudResult());
  },

  onLoadAllCompleted(tasks) {
    this.setData(tasks.map((task) => assign({}, task, {
      editing: false
    })));
  },

  crudResult() {
    return {
      Ok: (tasks) => this.setData(tasks),
      Err: (err) => console.error('store error:', err),
    };
  },

  setData(newData) {
    this.data = newData;
    this.trigger(this.data);
  },

  init() {
    this.data = this.getInitialState();
  },

  getInitialState() {
    return [];
  }
});


module.exports = {
  tasks: tasks,
};
