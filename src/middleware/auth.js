const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log('auth, token: ', token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('auth, decoded: ', decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user

        console.log('auth user id: ', user.email)
        next()
    } catch (e) {
        res.status(401).send({error: e})

    }

    // console.log('auth middleware')
    // next()
}

module.exports = auth
