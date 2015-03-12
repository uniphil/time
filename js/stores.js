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


function createLocalStore(key, empty, def) {
  var store = Reflux.createStore(assign({}, {
    getInitialState() {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(empty));
    },
    saveLocal() {
      localStorage.setItem(key, JSON.stringify(this.data));
    },
  }, def));
  window.addEventListener('storage', (e) => {
    if (e.key === key) {
      store.setData(JSON.parse(e.newValue)).unwrap();
    }
  });
  return store;
}


var config = createLocalStore('config', {}, {

  listenables: actions.config,

  onSet(update) {
    this.setData(assign(this.data, update));
  },

  onSetFailedValidation(why) {
    console.error('validating config change failed', why);
  },

});


var tasks = createLocalStore('tasks', [], {

  listenables: actions.tasks,

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

});


var backups = createLocalStore('backups', [], {

  listenables: actions.taskBackups,

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

});


function _group(quantizer, tasks) {
  var grouped = [],
      keyIndexMap = {},
      i, j, k, ks, t;

  for (i = 0; i < tasks.length; i++) {
    t = tasks[i];
    ks = quantizer(t);
    for (j = 0; j < ks.length; j++) {
      k = ks[j];
      if (typeof keyIndexMap[k] === 'undefined') {
        keyIndexMap[k] = grouped.length;
        grouped.push({group: k, children: []});
      }
      grouped[keyIndexMap[k]].children.push(t);
    }
  }

  return grouped;
}

var quantizers = {
  date: (t) => [(new Date(t.timestamp)).toLocaleDateString()],
  project: (t) => [t.project],
  tag: (t) => t.tags,
};

function qgroup(qname, tasks) {
  return {
    type: 'group',
    name: qname,
    children: _group(quantizers[qname], tasks),
  };
}

function nestGroups(groupers, tasks) {
  if (!groupers.length) { return tasks; }
  var grouped = qgroup(groupers[0], tasks);
  grouped.children = grouped.children.map((g) => assign(g, {
    children: nestGroups(groupers.slice(1), g.children),
  }));
  return grouped;
}


var query = Reflux.createStore({

  listenables: actions.query,

  onSet(newQuery) {
    this.setData((tasks) => nestGroups(newQuery.group, tasks))
  },

  getInitialState() {
    return (tasks) => nestGroups(['date'], tasks);
  },

});


module.exports = {
  tasks: tasks,
  backups: backups,
  config: config,
  query: query,
};
