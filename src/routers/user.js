const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

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


router.post('/users/logout', auth, async (req, res) => {
    console.log('logout, req.token: ', req.token)
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            // if they are equal (token of the logged in device),
            // return false, filtering it out, removing it. 
            // console.log('token.token: ', token.token)
            // console.log('req.user.token: ', req.token)
            const thebool = (token.token !== req.token)
            // console.log('thebool: ', thebool)
            return thebool
        })
        await req.user.save()
        
        console.log('req.user.tokens : ', req.user.tokens)
        res.send()
    } catch (e) {
        res.status(500).send('logout token error: ', e)
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
//        const user = await User.findById(req.params.id)
        // const user = req.user
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // if (!user) {
        //     return res.status(404).send()
        // }
        console.log('update req.user: ', req.user)
        res.send(req.user)
    } catch (e) {
        console.log('update error: ', e)
        res.status(400).send(e)
    }
})

router.delete('/users/me', async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user.id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(user)
    } catch (e) {
        console.log('delete error: ', e)
        res.status(500).send()
    }
})


module.exports = router
