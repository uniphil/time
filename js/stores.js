var assign = require('object-assign');
var {Ok, Err} = require('results');
var Reflux = require('reflux');
var crud = require('./crud');
var c = require('./constants');
var actions = require('./actions');


function crudResult(crudStore) {
  return {
    Ok: (things) => crudStore.setData(things),
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
    tmpThing = assign({}, thing, {
      id: thing.clientId,
      pending: true,
    });
    crud.create(this.getData(), tmpThing)(crudResult(this));
  },

  onCreateFailedValidation(thing, errors) {
    console.warn('thing failed validation :(', thing, errors);
  },

  onCreateCompleted([savedThing, clientId]) {
    crud.del(this.getData(), clientId)
      .andThen((things) => crud.create(things, savedThing))
      .andThen((things) => this.setData(things))
      .unwrap();  // throws if err
  },

  onCreateFailed([err, clientId]) {
    console.error('Failed to create time log', err);
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

  onLoad() {
    this.data.status = Err(c.LOADING);
    this.emit();
  },

  onLoadCompleted(tasks) {
    this.data.status = Ok(c.LOADED);
    this.setData(tasks.map((task) => assign({}, task, {
      editing: false
    })));
  },

  onLoadFailed(err) {
    this.data.status = Err(c.LOAD_FAILED);
    this.emit();
  },

  get(id) {
    return crud.get(this.getData(), id);
  },

  getWith(test) {
    return crud.getWith(this.getData(), test);
  },

};


var tasks = Reflux.createStore({
  mixins: [crudMethods],
  listenables: actions.tasks,
});


module.exports = {
  tasks: tasks,
};
