const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId}, process.env.JWT_SECRET)
    }]
}


beforeEach(async () => {
    console.log('before Each')
    await User.deleteMany()
    await new User(userOne).save()
})

afterEach(() => {
    console.log('after Each')
})

test('Should signup a new user', async() => {
    await request(app).post('/users').send({
        name: 'sun pochin',
        email: 'sunpochin@gmail.com',
        password: '56what!!'
    }).expect(201)

})

test('should login existing user', async() =>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('should not login non-existing user', async() => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'badpassword'
    }).expect(400)
    
})

test('should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should NOT get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


// test('Should delete account', async() => {
//     await request(app)
//         .delete('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
// })


// test('Should NOT delete account for un', async() => {
//     await request(app)
//         .delete('/users/me')
// //        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(401)
// })




