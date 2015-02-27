var Reflux = require('reflux');
var api = require('./api');
var validate = require('./validate');


var task = {};

task.log = Reflux.createAction({
  children: ['failedValidation'],
  asyncResult: true,
});
task.log.listenAndPromise(api.log);
task.log.shouldEmit = (task) => {
  if (validate.task(task)) {
    return true;
  } else {
    task.log.failedValidation(task, validate.errors);
    return false;
  }
};

task.beginEdit = Reflux.createAction();
task.cancelEdit = Reflux.createAction();

task.update = Reflux.createAction({asyncResult: true});
task.update.listenAndPromise(api.update);

task.remove = Reflux.createAction({asyncResult: true});
task.remove.listenAndPromise(api.remove);

task.loadAll = Reflux.createAction({asyncResult: true});
task.loadAll.listenAndPromise(api.load);


module.exports = {
  task: task
};
