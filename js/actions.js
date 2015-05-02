'use strict';
var assign = require('object-assign');
var shortid = require('shortid');
var Reflux = require('reflux');
var {pick} = require('./utils');
// var validate = require('./validate');


// Reflux.ActionMethods = assign(Reflux.ActionMethods || {}, {
//   validateWith(validator) {
//     this.failedValidation = Reflux.createAction();
//     this.shouldEmit = (payload) => {
//       if (validator(payload)) {
//         return true;
//       } else {
//         this.failedValidation(payload, validator.errors);
//         return false;
//       }
//     };
//   },

// });


var tasks = {};
tasks.ui = {};

tasks.create = Reflux.createAction();
tasks.ui.create = Reflux.createAction();
// tasks.ui.create.validateWith(validate.newTask);

tasks.update = Reflux.createAction();
tasks.ui.update = Reflux.createAction();
// tasks.ui.update.validateWith(validate.updatedTask);

tasks.remove = Reflux.createAction();
tasks.ui.remove = Reflux.createAction();
// tasks.ui.remove.validateWith(validate.removeTask);

tasks.unremove = Reflux.createAction();
tasks.ui.unremove = Reflux.createAction();
// tasks.ui.unremove.validateWith(validate.unremoveTask);

tasks.localSync = Reflux.createAction();


var config = {};
config.set = Reflux.createAction();
// config.set.validateWith(validate.config);
config.localSync = Reflux.createAction();


var query = {};
query.set = Reflux.createAction();


// ui => real actions
var deviceId = (function(id) {
  return {
    get() { return id; },
    generate() { return id + ':' + shortid.generate(); },
  };
})(localStorage.getItem('deviceId') || shortid.generate());


tasks.ui.create.listen((task) => tasks.create(assign({
  id: deviceId.generate(),
  action: 'create',
  timestamp: +new Date(),
  removed: false,
}, pick(['duration', 'project', 'summary', 'tags'], task))));

tasks.ui.update.listen((oldTask, newTask) => {
  if (oldTask.id !== newTask.id) {
    throw new Error('Task update with different task ids');
  }
  var picks = [];
  if (newTask.duration !== oldTask.duration) {
    picks.push('duration');
  }
  if (newTask.project !== oldTask.project) {
    picks.push('project');
  }
  if (newTask.summary !== oldTask.summary) {
    picks.push('summary');
  }
  if (newTask.tags.length !== oldTask.tags.length ||
      newTask.tags.some((tag, i) => tag !== oldTask.tags[i])) {
    picks.push('tags');
  }
  var update = pick(picks, newTask);
  tasks.update({
    id: deviceId.generate(),
    action: 'update',
    taskId: oldTask.id,
    update: update,
  });
});

tasks.ui.remove.listen((id) => tasks.remove({
  id: deviceId.generate(),
  action :'remove',
  taskId: id,
}));

tasks.ui.unremove.listen((id) => tasks.remove({
  id: deviceId.generate(),
  action :'unremove',
  taskId: id,
}));


module.exports = {
  tasks: tasks,
  config: config,
  query: query,
};
