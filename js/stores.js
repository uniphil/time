var assign = require('object-assign');
var murmur = require('murmurhash-js/murmurhash3_gc');
var {Ok, Err} = require('results');
var Reflux = require('reflux');
var crud = require('./crud');
var c = require('./constants');
var actions = require('./actions');


Reflux.StoreMethods = assign(Reflux.StoreMethods || {}, {
  init() {
    this.data = this.getInitialState();
  },
  emit() {
    this.trigger(this.data);
  },
});


function crudResult(crudStore) {
  return {
    Ok: (stuff) => crudStore.setData(stuff),
    Err: (err) => console.error('store error:', err),
  };
}


var crudMethods = {

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
  onRemove(id) {
    this.get(id).andThen((task) => {
      actions.taskBackups.create.triggerPromise(task)
        .then(crudMethods.onRemove.call(this, id))
        .catch((err) => console.error('creating backup failed, not deleting', err));
    });
  },
  emit() {
    // process data for display
    var tasks = this.data.ls.map((task) => assign({}, task, {
      hue: murmur(task.project, config.data.seed) % 360,
    }));
    this.trigger(assign({}, this.data, {ls: tasks}));
  },
});


var backups = Reflux.createStore({
  mixins: [crudMethods],
  listenables: actions.taskBackups,
  onRestore(id) {
    this.get(id).andThen((task) => {
      actions.tasks.create.triggerPromise(task)
        .then(actions.taskBackups.remove(id))
        .catch((err) => console.error('restoring task failed', err));
    });
  },
  emit() {
    // process data for display
    var tasks = this.data.ls.map((task) => assign({}, task, {hue: 350}));
    this.trigger(assign({}, this.data, {ls: tasks}));
  },
});


var config = Reflux.createStore({

  listenables: actions.config,

  init() {
    actions.config.load();
    this.data = this.getInitialState();
  },

  onLoadCompleted(config) {
    this.setData(config);
  },

  onSetFailedValidation(why) {
    console.error('validating config change failed', why);
  },

  onSetCompleted(newConfig) {
    this.setData(newConfig);
  },

  setData(update) {
    this.data = assign({}, this.data, update);
    this.emit();
  },

  getInitialState() {
    return {seed: 0};
  },

});


tasks.listenTo(config, tasks.emit);


module.exports = {
  tasks: tasks,
  backups: backups,
  config: config,
};
