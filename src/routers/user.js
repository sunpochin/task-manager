const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.get('/test', (req, res) => {
    res.send('From a new file.')
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findbyCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.send( {user, token} )
//        res.send(user)
    } catch (e) {
        console.log('users/login e: ', e)
        res.status(400).send()
    }
})


router.post('/users', async (req, res) => {
//    console.log('post users req: ', req)
    const user = new User(req.body)

    try {
        await user.save()

        const token = await user.generateAuthToken()
        res.status(201).send( {user, token} )

        // res.status(201).send(user)
    } catch (e) {
        console.log('post users e: ', e)
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
//    console.log('get users req: ', req)
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        console.log('get users e: ', e)
        res.send(e)
//        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router