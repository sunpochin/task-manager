const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     res.status(503).send('Site down maintenance come back soon.')
// })


app.use(express.json())

app.use(taskRouter)
app.use(userRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')
const main = async () => {
    // const task = await Task.findById('5ec69e3973362a256a4f3cbd')
    // await task.populate('owner').execPopulate()
    // console.log('task.owner: ', task.owner)

    const user = await User.findById('5ec69dfed3823924c10fb9d4')
    await user.populate('tasks').execPopulate()
    console.log('user.tasks: ', user.tasks)

}

main()

