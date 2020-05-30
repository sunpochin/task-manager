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
            throw new Error('please auth')
        }
        req.token = token
        req.user = user

        console.log('auth user id: ', user.email)
        next()
    } catch (e) {
        const errormsg = 'Error: ' + e
//        console.log('e:', e)
        res.status(401).send(errormsg)

    }

    // console.log('auth middleware')
    // next()
}

module.exports = auth
