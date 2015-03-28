var assign = require('object-assign');
var shortid = require('shortid');
var {Ok, Err} = require('results');
var Reflux = require('reflux');
var {pick, omit, findSpec} = require('./utils');
var actions = require('./actions');


var DataStoreMixin = {
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
};


function createLocalStore(key, empty, def) {
  var store = Reflux.createStore(assign({}, {
    mixins: [DataStoreMixin],
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



var deviceId = Reflux.createStore({
  init() {
    this.data = this.getInitialState();
  },
  getInitialState() {
    if (localStorage.getItem('deviceId') === null) {
      localStorage.setItem('deviceId', shortid.generate());
    }
    return localStorage.getItem('deviceId');
  },
  get() {
    return this.data;
  },
  generate() {
    return this.data + ':' + shortid.generate();
  },
});



var uiTasksProcessor = Reflux.createStore({

  listenables: actions.tasks.ui,

  onCreate(task) {
    actions.tasks.create(assign({
      id: deviceId.generate(),
      action: 'create',
      timestamp: +new Date(),
      removed: false,
    }, pick(['duration', 'project', 'summary', 'tags'], task)));
  },

  onUpdate(id, update) {
    actions.tasks.update({
      id: deviceId.generate(),
      action: 'update',
      taskId: id,
      update: update,
    });
  },

  onRemove(id) {
    actions.tasks.remove({
      id: deviceId.generate(),
      action :'remove',
      taskId: id,
    });
  },

  onUnremove(id) {
    actions.tasks.remove({
      id: deviceId.generate(),
      action :'unremove',
      taskId: id,
    });
  },

});



var taskActionLog = Reflux.createStore({

  listenables: actions.tasks,

  init() {
    this.data = this.getInitialState();
    window.addEventListener('storage', (e) => {
      if (e.key === 'taskActionLog') {
        this.data = JSON.parse(e.newValue);
        this.trigger(this.data);
      }
    });
  },

  onCreate(newTask) {
    this.pushLog(newTask);
  },

  onUpdate(update) {
    this.pushLog(update);
  },

  onRemove(removal) {
    this.pushLog(removal);
  },

  onUnremove(unremoval) {
    this.pushLog(unremoval);
  },

  pushLog(log) {
    this.data.push(log);
    localStorage.setItem('taskActionLog', JSON.stringify(this.data));
    this.trigger(this.data);
  },

  getInitialState() {
    return JSON.parse(localStorage.getItem('taskActionLog') || '[]');
  },

});


var tasks = Reflux.createStore({

  init() {
    this.listenTo(taskActionLog, this.updateLog, this.initLog);
  },

  initLog(initialLogs) {
    this.setData(this.processLogs(initialLogs), true);
  },

  getInitialState() {
    if (this.data === undefined) { throw new Error('uninitialized tasks :('); }
    return this.data;
  },

  updateLog(newLogs) {
    this.setData(this.processLogs(newLogs));
  },

  setData(data, quiet) {
    // todo: use a default filter query instead
    this.data = data.filter((t) => !t.removed);
    !quiet && this.emit();
  },

  emit() {
    this.trigger(this.data);
  },

  processLogs(logs) {
    return logs.reduce((list, log) => {
      if (log.action === 'create') {
        list.unshift(pick(['id', 'timestamp', 'duration', 'project', 'summary', 'tags'], log));
      } else if (log.action === 'update') {
        findSpec({id: log.taskId}, list).match({
          Some: (task) => assign(task, log.update),
          None: () => console.error('could not find task', (log ? log.taskId : '???'),
                                    'to update to', log),
        });
      } else if (log.action === 'remove') {
        findSpec({id: log.taskId}, list).match({
          Some: (task) => assign(task,  {removed: true}),
          None: () => console.error('could not find task', (log? log.taskId : '??'), 'to remove'),
        });
      } else if (log.action === 'unremove') {
        findSpec({id: log.taskId}, list).match({
          Some: (task) => assign(task,  {removed: false}),
          None: () => console.error('could not find task', (log? log.taskId : '??'), 'to unremove'),
        });
      } else {
        console.error('cannot process action', log ? log.action : '??', 'for log', log);
      }
      return list;
    }, []);
  }

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

  init() {
    this.data = this.getInitialState();
  },

  onSet(newQuery) {
    this.setData((tasks) => nestGroups(newQuery.group, tasks))
  },

  setData(data) {
    this.data = data;
    this.emit();
  },

  emit() {
    this.trigger(this.data);
  },

  getInitialState() {
    return (tasks) => nestGroups(['date'], tasks);
  },

});


module.exports = {
  tasks: tasks,
  config: config,
  query: query,
};
