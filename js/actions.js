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
  children: ['failedValidation'],
  asyncResult: true,
  preEmit: (task) => [assign({}, task, {clientId: 'c' + clientId++})],
});
tasks.create.validateWith(validate.task);
tasks.create.listenAndPromise(api.createTask);

tasks.beginEdit = Reflux.createAction();
tasks.cancelEdit = Reflux.createAction();

tasks.update = Reflux.createAction({asyncResult: true});
tasks.update.listenAndPromise(api.updateTask);

tasks.remove = Reflux.createAction({asyncResult: true});
tasks.remove.listenAndPromise(api.removeTask);

tasks.load = Reflux.createAction({asyncResult: true});
tasks.load.listenAndPromise(api.loadTasks);


var projects = {};

projects.create = Reflux.createAction({
  children: ['failedValidation'],
  asyncResult: true,
});
projects.create.validateWith(validate.project);

projects.beginEdit = Reflux.createAction();
projects.cancelEdit = Reflux.createAction();

projects.update = Reflux.createAction({asyncResult: true});
projects.update.listenAndPromise(api.updateProject);

projects.remove = Reflux.createAction({asyncResult: true});
projects.remove.listenAndPromise(api.removeProject);

projects.load = Reflux.createAction({asyncResult: true});
projects.load.listenAndPromise(api.loadProjects);


module.exports = {
  tasks: tasks,
  projects: projects,
};
