const mongoose = require('mongoose')
const validator = require('validator')


const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Number
    }
})

const task = new Task({
    description: 'Learn the Mongoose library',
    completed: false,
})

