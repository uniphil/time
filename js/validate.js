var validator = require('is-my-json-valid');

var task = validator({
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    timestamp: {
      description: 'datetime of task completion (implied by entry)',
      type: 'integer',
      minimum: 0,
    },
    duration: {
      description: 'time spent on the task in minutes',
      type: 'integer',
      minimum: 0,
    },
    summary: {
      type: 'string',
    },
    project: {
      type: 'string',
    },
    tags: {
      type: 'array',
      items: {
        type: 'string'
      },
      uniqueItems: true,
    }
  },
  required: [ 'timestamp', 'duration', 'summary', 'tags' ],
});


module.exports = {
  task: task,
};
