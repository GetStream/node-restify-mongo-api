'use strict'

const mongoose = require('mongoose'),
      mongooseApiQuery = require('mongoose-api-query'),
      createdModified = require('mongoose-createdmodified').createdModifiedPlugin

const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'complete', 'overdue']
    },
}, { minimize: false });

TodoSchema.plugin(mongooseApiQuery)
TodoSchema.plugin(createdModified, { index: true })

const Todo = mongoose.model('Todo', TodoSchema)
module.exports = Todo
