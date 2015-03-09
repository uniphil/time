var assign = require('object-assign');
var Reflux = require('reflux');
var validate = require('./validate');


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
  },
});


var tasks = {};
tasks.create = Reflux.createAction();
tasks.create.validateWith(validate.task);
tasks.update = Reflux.createAction();
tasks.remove = Reflux.createAction();
tasks.localSync = Reflux.createAction();


var taskBackups = {};
taskBackups.create = Reflux.createAction();
taskBackups.create.validateWith(validate.task);
taskBackups.restore = Reflux.createAction();
taskBackups.reallyRemove = Reflux.createAction();
taskBackups.localSync = Reflux.createAction();


var config = {};
config.set = Reflux.createAction();
config.set.validateWith(validate.config);
config.localSync = Reflux.createAction();


module.exports = {
  tasks: tasks,
  taskBackups: taskBackups,
  config: config,
};
