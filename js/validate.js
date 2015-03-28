var validator = require('is-my-json-valid');

var newTask = validator({
  type: 'object',
  properties: {
    id: { type: 'string' },
    action: {
      type: 'string',
      enum: ['create'],
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
    summary: { type: 'string' },
    project: { type: 'string' },
    tags: {
      type: 'array',
      items: { type: 'string' },
      uniqueItems: true,
    },
  },
  required: [
    'id',
    'action',
    'timestamp',
    'duration',
    'summary',
    'tags'
  ],
});


var updateTask = validator({
  type: 'object',
  properties: {
    id: { type: 'string' },
    action: {
      type: 'string',
      enum: ['update'],
    },
    update: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        updates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              set: {
                type: {
                  enum: [
                    'string',
                    'array',
                  ],
                },
              },
            },
            required: [
              'field',
              'set',
            ],
          },
        },
        required: [
          'id',
          'updates',
        ],
      },
    },
  },
  required: [
    'id',
    'action',
    'update',
  ],
});


var config = validator({
  type: 'object',
  properties: {
    seed: {
      description: 'seed for generating stuff like project colours',
      type: 'integer',
      minimum: 0,
    },
  },
});


module.exports = {
  newTask: newTask,
  updateTask: updateTask,
  removeTask: removeTask,
  unremoveTask: unremoveTask,
  config: config,
};
