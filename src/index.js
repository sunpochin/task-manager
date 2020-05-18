
const express = require('express')
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json() )

app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.send(user)
        console.log('user: ', user)
    }).catch(() => {

    })

    // console.log('req: ', req)
    // console.log('req.body: ', req.body)
    // res.send('testing!')
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.send(task)
        console.log('task: ', task)
    }).catch(() => {

    })

    // console.log('req: ', req)
    // console.log('req.body: ', req.body)
    // res.send('testing!')
})


app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send()
    })

})



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})



