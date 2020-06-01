const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

afterEach(() => {
    // console.log('after Each')
})

test('Should signup a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'sun pochin',
        email: 'sunpochin@gmail.com',
        password: '56what!!'
    }).expect(201)

    // database changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //
    expect(response.body).toMatchObject({
        user: {
            name: 'sun pochin',
            email: 'sunpochin@gmail.com'
        },
        token: user.tokens[0].token
    })
    //
    expect(user.password).not.toBe('56what!!')
})

test('should login existing user', async() =>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
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

//     const user = await User.findById(userOneId)
//     expect(user).toBeNull()
// })


// test('Should NOT delete account for un', async() => {
//     await request(app)
//         .delete('/users/me')
// //        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(401)
// })


test('Should upload avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/avatar.png')
        .expect(200)
    const user = await User.findById(userOneId)
    // to check if it's 'Any kind of Buffer'.
    // console.log('user.avatar:', user.avatar)
//    console.log('\n\n\n ', )
    expect(user.avatar).toEqual( expect.any(Buffer) )
})
  

test('Should update valid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jess'
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Jess')
})


test('Should not update valid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Taipei'
        })
        .expect(400)
})



