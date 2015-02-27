var Reflux = require('reflux');

var crud = require('./crud');
var actions = require('./actions');


var clientId = +(new Date());


var tasks = Reflux.createStore({

  listenables: actions,

  onLogTask(task) {
    task.id = clientId++;  // aah... this is mutating the main task woo js
    crud.create(this.data, task)(this.crudResult());
  },

  onUpdateTask(taskId, task) {
    crud.update(this.data, taskId, task)(this.crudResult());
  },

  onRemoveTask(taskId) {
    crud.del(this.data, taskId)(this.crudResult());
  },

  onLoadTasksCompleted(tasks) {
    this.data = tasks;
    this.trigger(this.data);
  },

  crudResult() {
    return {
      Ok: (tasks) => {
        this.data = tasks;
        this.trigger(this.data);
      },
      Err: (err) => {
        console.error('store error:', err);
      },
    };
  },

  init() {
    this.data = this.getInitialState();
  },

  getInitialState() {
    return [];
  }
});


module.exports = {
  tasks: tasks
};
