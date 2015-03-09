var assign = require('object-assign');
var {Ok, Err} = require('results');
var Reflux = require('reflux');
var crud = require('./crud');
var actions = require('./actions');


Reflux.StoreMethods = assign(Reflux.StoreMethods || {}, {
  init() {
    this.data = this.getInitialState();
  },
  setData(newData) {
    this.data = newData;
    this.emit();
    this.saveLocal && this.saveLocal();
    return Ok(this.data);
  },
  emit() {
    this.trigger(this.data);
  },
});


var config = Reflux.createStore({

  listenables: actions.config,

  getInitialState() {
    return JSON.parse(localStorage.getItem('config') || '{}');
  },

  onSet(update) {
    this.setData(assign(this.data, update));
  },

  onSetFailedValidation(why) {
    console.error('validating config change failed', why);
  },

  saveLocal() {
    localStorage.setItem('config', JSON.stringify(this.data));
    return Ok(this.data);
  },

  onLocalSync(newData) {
    this.setData(newData)
      .unwrap();
  },

});


var tasks = Reflux.createStore({

  listenables: actions.tasks,

  getInitialState() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  },

  onCreate(newTask) {
    newTask = assign({}, newTask, {
      id: '' + (Math.max.apply(null, this.data.map((t) => (parseInt(t.id, 10) || 0)).concat(0)) + 1),
    });
    crud.create(this.data, newTask)
      .andThen(this.setData.bind(this))
      .unwrap();  // throw & log the err if anything failed
  },

  onCreateFailedValidation(why) {
    console.error('validating config change failed', why);
  },

  onUpdate(id, updated) {
    crud.update(this.data, id, updated)
      .andThen(this.setData.bind(this))
      .unwrap();
  },

  onRemove(id) {
    crud.get(this.data, id)
      .andThen((task) => Ok(actions.taskBackups.create(task)))
      .andThen(() => crud.del(this.data, id))
      .unwrap();
    crud.del(this.data, id)
      .andThen(this.setData.bind(this))
      .unwrap();
  },

  onLocalSync(newData) {
    this.setData(newData)
      .unwrap();
  },

  saveLocal() {
    localStorage.setItem('tasks', JSON.stringify(this.data));
    return Ok(this.data);
  },

});


var backups = Reflux.createStore({

  listenables: actions.taskBackups,

  getInitialState() {
    return JSON.parse(localStorage.getItem('backups') || '[]');
  },

  onCreate(savedTask) {
    savedTask = assign({}, savedTask, {
      id: '' + (Math.max.apply(null, this.data.map((t) => (parseInt(t.id, 10) || 0)).concat(0)) + 1),
      deleted: true,
    });
    crud.create(this.data, savedTask)
      .andThen(this.setData.bind(this))
      .unwrap();  // throw & log the err if anything failed
  },

  onCreateFailedValidation(why) {
    console.error('validating config change failed', why);
  },

  onRestore(id) {
    crud.get(this.data, id)
      .andThen((task) => {
        task = assign({}, task);
        delete task.deleted;
        return Ok(actions.tasks.create(task))
      })  // todo fail and bail if err
      .andThen(() => crud.del(this.data, id)
        .andThen(this.setData.bind(this)))
      .unwrap();
  },

  onReallyRemove(id) {
    crud.del(this.data, id)
      .andThen(this.setData.bind(this))
      .unwrap();
  },

  onLocalSync(newData) {
    this.setData(newData)
      .unwrap();
  },

  saveLocal() {
    localStorage.setItem('backups', JSON.stringify(this.data));
    return Ok(this.data);
  },

});


window.addEventListener('storage', (e) => {
  if (e.key === 'config') {
    actions.config.localSync(JSON.parse(e.newValue));
  }
});


window.addEventListener('storage', (e) => {
  if (e.key === 'tasks') {
    actions.tasks.localSync(JSON.parse(e.newValue));
  }
});


window.addEventListener('storage', (e) => {
  if (e.key === 'backups') {
    actions.taskBackups.localSync(JSON.parse(e.newValue));
  }
});


module.exports = {
  tasks: tasks,
  backups: backups,
  config: config,
};
