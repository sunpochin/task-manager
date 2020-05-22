const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id }, 'thisismynewcourse')

    const decoded = jwt.verify(token ,'thisismynewcourse')
    // console.log('decoded: ', decoded)

//    console.log('user.tokens: ', user.tokens)
    user.tokens = user.tokens.concat({ token: token})
    await user.save()

    return token
}


userSchema.statics.findbyCredentials = async (email, password) => {
    console.log('email: ', email)

    const user = await User.findOne({email: email})

    console.log('user: ', user)

    if (!user) {
        throw new Error('not able to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('not able to login!')
    }

    return user
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password') ) {
        console.log('password isModified: ', user.password)
        user.password = await bcrypt.hash(user.password, 8)
        console.log('new password hash: ', user.password)
    }
    console.log('just before save')

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User

