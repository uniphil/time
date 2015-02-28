var assign = require('object-assign');
var {Ok, Err} = require('results');
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
    return {
      ls: [],
      status: Err(c.NOT_LOADED),
    };
  },

  getData: function() {
    return this.data.ls;
  },

  setData: function(newData) {
    this.data.ls = newData;
    this.emit();
    return Ok(c.OK);
  },

  emit: function() {
    this.trigger(this.data);
  },

  onCreate(thing) {
    crud.create(this.getData(), thing)(crudResult(this));
  },

  onBeginEdit(id) {
    var thing = crud.get(this.getData(), id).expect(c.NOT_FOUND);  // throws if no thing
    var editingThing = assign({}, thing, {editing: true});
    crud.update(this.getData(), id, editingThing)(crudResult(this));
  },

  onCancelEdit(id) {
    var thing = crud.get(this.getData(), id).expect(c.NOT_FOUND);  // throws if no thing
    var editingThing = assign({}, thing, {editing: false});
    crud.update(this.getData(), id, editingThing)(crudResult(this));
  },

  onUpdate(id, thing) {
    crud.update(this.getData(), id, thing)(crudResult(this));
  },

  onRemove(id) {
    crud.del(this.getData(), id)(crudResult(this));
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
    crud.create(this.getData(), tmpTask)(crudResult(this));
  },

  onLogFailedValidation(task, errors) {
    console.warn('task failed validation :(', task, errors);
  },

  onLogCompleted([savedTask, clientId]) {
    crud.del(this.getData(), clientId)
      .andThen((tasks) => crud.create(tasks, savedTask))
      .andThen((tasks) => this.setData(tasks))
      .unwrap();  // throws if err
  },

  onLogFailed([err, clientId]) {
    console.error('Failed to create time log', err);
  },

  onLoadAll() {
    this.data.status = Err(c.LOADING);
    this.emit();
  },

  onLoadAllCompleted(tasks) {
    this.data.status = Ok(c.LOADED);
    this.setData(tasks.map((task) => assign({}, task, {
      editing: false
    })));
  },

  onLoadAllFailed(err) {
    this.data.status = Err(c.LOAD_FAILED);
    this.emit();
  },

  get(taskId) {
    return crud.get(this.getData(), taskId)
      .okOr(this.data.status);  // loading or load_failed
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
