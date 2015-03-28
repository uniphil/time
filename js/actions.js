var assign = require('object-assign');
var Reflux = require('reflux');
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
// tasks.ui.create.listen((t) => console.log(t));
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


module.exports = {
  tasks: tasks,
  config: config,
  query: query,
};
