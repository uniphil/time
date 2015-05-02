'use strict';

var $;  // dummy

module.exports=((s)=>Object.keys(s).reduce((o,k)=>{o[k]={c:k};return o;},{}))
({
  ERR_NOT_KNOWN: $,
  MISSING_ID: $,
  NOT_FOUND: $,
  OK: $,
  NOT_LOADED: $,
  LOADING: $,
  LOADED: $,
  LOAD_FAILED: $,
});
