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


function getList(key) {
  return JSON.parse(localStorage[key] || '[]');
}

function setList(key, stuff) {
  localStorage[key] = JSON.stringify(stuff);
  return stuff;
}

function getObj(key) {
  return JSON.parse(localStorage[key] || '{}');
}

function setObj(key, obj) {
  var newObj = assign({}, getObj(key), obj);
  localStorage[key] = JSON.stringify(newObj);
  return newObj;
}


function crudResult(d, key) {
  return {
    Ok: (newTasks) => {
      setList(key, newTasks);
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
    return fakeDelay((d) => crud.create(getList(key), thing)({
      Ok: (updatedThings) => {
        setList(key, updatedThings);
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
    var args = [getList(key)].concat(Array.prototype.slice.apply(arguments));
    return fakeDelay((d) => crud[operation].apply(null, args)(crudResult(d, key)));
  };
}

var createTask = localCR('tasks');
var updateTask = localUD('update', 'tasks');
var removeTask = localUD('del', 'tasks');
var loadTasks = () => fakeDelay((d) => d.resolve(getList('tasks')), 0);

var saveBackup = localCR('backups');
var reallyDelete = localUD('del', 'backups');
var loadBackups = () => fakeDelay((d) => d.resolve(getList('backups')), 0);


var setConfig = (obj) => fakeDelay((d) => d.resolve(setObj('config', obj)), 0);
var loadConfig = () => fakeDelay((d) => d.resolve(getObj('config')), 0);


module.exports = {
  createTask: createTask,
  updateTask: updateTask,
  removeTask: removeTask,
  loadTasks: loadTasks,
  saveBackup: saveBackup,
  loadBackups: loadBackups,
  reallyDelete: reallyDelete,
  setConfig: setConfig,
  loadConfig: loadConfig,
};
