var assign = require('object-assign');
var Q = require('q');
var c = require('./constants');
var crud = require('./crud');


var apiId = +new Date() / 2;


function fakeDelay(fn, altTime) {
  var d = Q.defer();
  window.setTimeout(() => fn(d), altTime || 200);
  return d.promise;
}


function set(key, stuff) {
  localStorage[key] = JSON.stringify(stuff);
}

function get(key) {
  return JSON.parse(localStorage[key] || "[]");
}


function crudResult(d, key) {
  return {
    Ok: (newTasks) => {
      set(key, newTasks);
      d.resolve(c.OK);
    },
    Err: (err) => {
      console.warn('crud failure', err);
      d.reject(err);
    }
  };
}

function localCrud(operation, key) {
  return (/* arguments */) => {
    var args = [get(key)].concat(Array.prototype.slice.apply(arguments));
    return fakeDelay((d) => crud[operation].apply(null, args)(crudResult(d, key)));
  };
}

var logTask = (newTask) => {
  var clientId = newTask.clientId;
  task = assign({}, newTask, {id: '' + apiId++});
  delete task.clientId;
  return fakeDelay((d) => crud.create(get('tasks'), task)({
    Ok: (updatedTasks) => {
      set('tasks', updatedTasks);
      d.resolve([task, clientId]);
    },
    Err: (err) => {
      d.reject([err, clientId]);
    },
  }));
};
var updateTask = localCrud('update', 'tasks');
var removeTask = localCrud('del', 'tasks');
var loadTasks = () => fakeDelay((d) => d.resolve(get('tasks')), 0);

var createProject = localCrud('create', 'projects');
var updateProject = localCrud('update', 'projects');
var removeProject = localCrud('del', 'projects');
var loadProjects = () => fakeDelay((d) => d.resolve(get('projects')));


module.exports = {
  logTask: logTask,
  updateTask: updateTask,
  removeTask: removeTask,
  loadTasks: loadTasks,
  createProject: createProject,
  updateProject: updateProject,
  removeProject: removeProject,
  loadProjects: loadProjects,
};
