const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const response = sendWelcomeEmail(user.email, user.name)
        console.log('response:', response);

        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    console.log('/users/me/avatar')

    try {
        req.user.avatar = undefined;
        sendCancelationEmail(user.email, user.name)
        await req.user.save();
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }

})



const upload = multer({
    limits: {
        fileSize: 100000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image!') )
        }
        // this first params of cb should be undefined, if it's 'upload OK' it would not work.
        cb(undefined, true)
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), 
    async (req, res) => {
    // console.log('req.file: ', req.file)
    try {
        const buffer = await sharp(req.file.buffer)
            .resize({width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer
        // req.user.avatar = req.file.buffer
        await req.user.save()
        res.send() 
    } catch (e) {
        console.log('avatar: ', e)
        res.status(500).send(e)
    }
}, (error, req, res, next) => {
    console.log('avatar error: ', error)

    res.status(400).send({ error: error.message})
})

router.get('/users/:id/avatar', async(req, res) => {
    console.log('/users/:id/avatar, ')
    try {
        console.log('req.params, ', req.params)
        const user = await User.findById(req.params.id)
        console.log('user, ', user)
        if (!user || !user.avatar) {
            console.log('user or avatar not found!!! ')
            throw new Error('user or avatar not found!!! ')
        }

        console.log('user.avatar, ', user.avatar)
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
        
    } catch (error) {
        console.log('error: ', error)

        res.status(404).send(error)
    }
})


module.exports = router

