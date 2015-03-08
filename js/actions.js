var assign = require('object-assign');
var Reflux = require('reflux');
var api = require('./api');
var validate = require('./validate');


var clientId = +new Date();


Reflux.ActionMethods = assign(Reflux.ActionMethods || {}, {
  validateWith(validator) {
    this.failedValidation = Reflux.createAction();
    this.shouldEmit = (payload) => {
      if (validator(payload)) {
        return true;
      } else {
        this.failedValidation(payload, validator.errors);
        return false;
      }
    };
  }
});


var tasks = {};

tasks.create = Reflux.createAction({
  asyncResult: true,
  preEmit: (task) => [assign({}, task, {clientId: 'c' + clientId++})],
});
tasks.create.validateWith(validate.task);
tasks.create.listenAndPromise(api.createTask);

tasks.update = Reflux.createAction({asyncResult: true});
tasks.update.listenAndPromise(api.updateTask);

tasks.remove = Reflux.createAction({asyncResult: true});
tasks.remove.listenAndPromise(api.removeTask);

tasks.load = Reflux.createAction({asyncResult: true});
tasks.load.listenAndPromise(api.loadTasks);


var taskBackups = {};

taskBackups.create = Reflux.createAction({
  asyncResult: true,
  preEmit: (task) => [assign({}, task, {clientId: 'c' + clientId++})],
});
taskBackups.create.validateWith(validate.task);
taskBackups.create.listenAndPromise(api.saveBackup);

taskBackups.restore = Reflux.createAction();

taskBackups.remove = Reflux.createAction({asyncResult: true});
taskBackups.remove.listenAndPromise(api.reallyDelete);

taskBackups.load = Reflux.createAction({asyncResult: true});
taskBackups.load.listenAndPromise(api.loadBackups);


var config = {};

config.set = Reflux.createAction({asyncResult: true});
config.set.validateWith(validate.config);
config.set.listenAndPromise(api.setConfig);

config.load = Reflux.createAction({asyncResult: true});
config.load.listenAndPromise(api.loadConfig);


module.exports = {
  tasks: tasks,
  taskBackups: taskBackups,
  config: config,
};
