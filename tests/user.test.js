const request = require('supertest')
const app = require('../src/app')

beforeEach(() => {
    console.log('before Each')
})

afterEach(() => {
    console.log('after Each')
})

test('Should signup a new user', async() => {
    await request(app).post('/users').send({
        name: 'sun pochin',
        email: 'sunpochin@gmail.com',
        password: 'testtest'
    }).expect(201)

})

