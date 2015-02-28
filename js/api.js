var assign = require('object-assign');
var Q = require('q');
var c = require('./constants');
var crud = require('./crud');


var apiId = +new Date() / 2;


function fakeDelay(fn, altTime) {
  var d = Q.defer();
  window.setTimeout(() => fn(d), altTime || 400);
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

function localCR(key) {
  return (newThing) => {
    var clientId = newThing.clientId,
        thing = assign({}, newThing, {id: '' + apiId++});
    delete thing.clientId;
    return fakeDelay((d) => crud.create(get(key), thing)({
      Ok: (updatedThings) => {
        set(key, updatedThings);
        d.resolve([thing, clientId]);
      },
      Err: (err) => {
        d.reject([err, clientId]);
      },
    }));
  };
}

function localUD(operation, key) {
  return (/* arguments */) => {
    var args = [get(key)].concat(Array.prototype.slice.apply(arguments));
    return fakeDelay((d) => crud[operation].apply(null, args)(crudResult(d, key)));
  };
}

var createTask = localCR('tasks');
var updateTask = localUD('update', 'tasks');
var removeTask = localUD('del', 'tasks');
var loadTasks = () => fakeDelay((d) => d.resolve(get('tasks')), 0);

var createProject = localCR('projects');
var updateProject = localUD('update', 'projects');
var removeProject = localUD('del', 'projects');
var loadProjects = () => fakeDelay((d) => d.resolve(get('projects')));


module.exports = {
  createTask: createTask,
  updateTask: updateTask,
  removeTask: removeTask,
  loadTasks: loadTasks,
  createProject: createProject,
  updateProject: updateProject,
  removeProject: removeProject,
  loadProjects: loadProjects,
};
