var Reflux = require('reflux');
var api = require('./api');
var validate = require('./validate');


var logTask = Reflux.createAction({
  children: ['failedValidation'],
  asyncResult: true,
});
logTask.listenAndPromise(api.log);
logTask.shouldEmit = (task) => {
  if (validate.task(task)) {
    return true;
  } else {
    logTask.failedValidation(task, validate.errors);
    return false;
  }
};


var beginEditTask = Reflux.createAction();
var cancelEditTask = Reflux.createAction();


var updateTask = Reflux.createAction({asyncResult: true});
updateTask.listenAndPromise(api.update);


var removeTask = Reflux.createAction({asyncResult: true});
removeTask.listenAndPromise(api.remove);


var loadTasks = Reflux.createAction({asyncResult: true});
loadTasks.listenAndPromise(api.load);


module.exports = {
  logTask: logTask,
  beginEditTask: beginEditTask,
  cancelEditTask: cancelEditTask,
  updateTask: updateTask,
  removeTask: removeTask,
  loadTasks: loadTasks
};

