var assign = require('object-assign');
var {Ok} = require('results');
var Reflux = require('reflux');
var crud = require('./crud');
var c = require('./constants');
var actions = require('./actions');


function crudResult(crudStore) {
  return {
    Ok: (tasks) => crudStore.setData(tasks),
    Err: (err) => console.error('store error:', err),
  };
}


var crudMethods = {
  init() {
    this.data = this.getInitialState();
  },

  getInitialState() {
    return [];
  },

  setData: function(newData) {
    this.data = newData;
    this.trigger(this.data);
    return Ok(c.OK);
  },

  onCreate(thing) {
    crud.create(this.data, thing)(crudResult(this));
  },

  onBeginEdit(id) {
    var thing = crud.get(this.data, id).expect(c.NOT_FOUND);  // throws if no thing
    var editingThing = assign({}, thing, {editing: true});
    crud.update(this.data, id, editingThing)(crudResult(this));
  },

  onCancelEdit(id) {
    var thing = crud.get(this.data, id).expect(c.NOT_FOUND);  // throws if no thing
    var editingThing = assign({}, thing, {editing: false});
    crud.update(this.data, id, editingThing)(crudResult(this));
  },

  onUpdate(id, thing) {
    crud.update(this.data, id, thing)(crudResult(this));
  },

  onRemove(id) {
    crud.del(this.data, id)(crudResult(this));
  },

};


var tasks = Reflux.createStore({

  mixins: [crudMethods],

  listenables: actions.task,

  onLog(task) {
    tmpTask = assign({}, task, {
      id: task.clientId,
      pending: true,
    });
    crud.create(this.data, tmpTask)(crudResult(this));
  },

  onLogFailedValidation(task, errors) {
    console.warn('task failed validation :(', task, errors);
  },

  onLogCompleted([savedTask, clientId]) {
    crud.del(this.data, clientId)
      .andThen((tasks) => crud.create(tasks, savedTask))
      .andThen((tasks) => this.setData(tasks))
      .unwrap();  // throws if err
  },

  onLogFailed([err, clientId]) {
    console.error('Failed to create time log', err);
  },

  onLoadAllCompleted(tasks) {
    this.setData(tasks.map((task) => assign({}, task, {
      editing: false
    })));
  },
});


var projects = Reflux.createStore({

  mixins: [crudMethods],

  listenables: actions.projects,

});


module.exports = {
  tasks: tasks,
  projects: projects,
};
