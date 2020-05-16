const mongoose = require('mongoose')
const validator = require('validator')


const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        validate(value) {

        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number.')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email address invalid!')
            }
        }

    }
})


// const me = new User({
//     name: 'Andrew',
//     email: 'mike@',
// })


// me.save().then(() => {
//     console.log(me)
// } ).catch((error) => {
//     console.log('Error! ', error)
// })



module.exports = User
