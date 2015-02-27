var Reflux = require('reflux');
var api = require('./api');


var logTask = Reflux.createAction({asyncResult: true});
logTask.listenAndPromise(api.log);


var updateTask = Reflux.createAction({asyncResult: true});
updateTask.listenAndPromise(api.update);


var removeTask = Reflux.createAction({asyncResult: true});
removeTask.listenAndPromise(api.remove);


var loadTasks = Reflux.createAction({asyncResult: true});
loadTasks.listenAndPromise(api.load);


module.exports = {
  logTask: logTask,
  updateTask: updateTask,
  removeTask: removeTask,
  loadTasks: loadTasks
};

