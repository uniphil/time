var assign = require('object-assign');
var Reflux = require('reflux');
var api = require('./api');
var validate = require('./validate');


var clientId = +new Date();


var task = {};

task.log = Reflux.createAction({
  children: ['failedValidation'],
  asyncResult: true,
  preEmit: (task) => [assign({}, task, {clientId: 'c' + clientId++})],
  shouldEmit: (task) => {
    if (validate.task(task)) {
      return true;
    } else {
      task.log.failedValidation(task, validate.errors);
      return false;
    }
  },
});
task.log.listenAndPromise(api.logTask);

task.beginEdit = Reflux.createAction();
task.cancelEdit = Reflux.createAction();

task.update = Reflux.createAction({asyncResult: true});
task.update.listenAndPromise(api.updateTask);

task.remove = Reflux.createAction({asyncResult: true});
task.remove.listenAndPromise(api.removeTask);

task.loadAll = Reflux.createAction({asyncResult: true});
task.loadAll.listenAndPromise(api.loadTasks);


var projects = {};

projects.create = Reflux.createAction({
  children: ['failedValidation'],
  asyncResult: true,
});
projects.create.listenAndPromise(api.createProject);
projects.create.shouldEmit = (project) => {
  if (validate.project(project)) {
    return true;
  } else {
    projects.create.failedValidation(project, validate.errors);
    return false;
  }
};

projects.beginEdit = Reflux.createAction();
projects.cancelEdit = Reflux.createAction();

projects.update = Reflux.createAction({asyncResult: true});
projects.update.listenAndPromise(api.updateProject);

projects.remove = Reflux.createAction({asyncResult: true});
projects.remove.listenAndPromise(api.removeProject);

projects.load = Reflux.createAction({asyncResult: true});
projects.load.listenAndPromise(api.loadProjects);


module.exports = {
  task: task,
  projects: projects,
};
