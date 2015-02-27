var Q = require('q');
var c = require('./constants');
var crud = require('./crud');


function fakeDelay(fn) {
  var d = Q.defer();
  window.setTimeout(() => fn(d), 200);
  return d.promise;
}


function set(tasks) {
  localStorage.tasks = JSON.stringify(tasks);
}

function get() {
  return JSON.parse(localStorage.tasks || "[]");
}


function crudResult(d) {
  return {
    Ok: (newTasks) => {
      set(newTasks);
      d.resolve(c.OK);
    },
    Err: (err) => {
      d.reject(err);
    }
  };
}


function log(task) {
  return fakeDelay((d) => crud.create(get(), task)(crudResult(d)));
}

function update(taskId, task) {
  return fakeDelay((d) => crud.update(get(), taskId, task)(crudResult(d)));
}

function remove(taskId) {
  return fakeDelay((d) => crud.del(get(), taskId)(crudResult(d)));
}


function load() {
  return fakeDelay((d) => {
    d.resolve(get());
  });
}


module.exports = {
  log: log,
  update: update,
  remove: remove,
  load: load
};
