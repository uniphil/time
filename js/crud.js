var assign = require('object-assign');
var {Some, None, Ok, Err} = require('results');
var c = require('./constants');


function get(from, id) /*-> Option */ {
  var match = from.filter((t) => t.id === id)[0];
  return match? Some(match) : None();
}


function create(from, new_) /*-> Result */ {
  if (typeof new_.id === 'undefined') {
    return Err(c.MISSING_ID);
  }
  var existing = from.filter((t) => t.id === new_.id)[0];
  if (existing) {
    return Err(c.EXISTS);
  }
  var withNew = from.concat([new_]);
  return Ok(withNew);
}


function update(from, id, new_) /*-> Result */ {
  var copy = from.concat();
  var updated = assign({}, new_, {id: id});
  return get(from, id)
    .okOr(c.NOT_FOUND)
    .andThen((old) => {
      copy.splice(copy.indexOf(old), 1, updated);
      return Ok(copy);
    });
}


function del(from, id) /*-> Result */ {
  var copy = from.concat();
  return get(from, id)
    .okOr(c.NOT_FOUND)
    .andThen((thing) => {
      copy.splice(copy.indexOf(thing), 1);
      return Ok(copy);
    });
}


module.exports = {
  get: get,
  create: create,
  update: update,
  del: del,
};
