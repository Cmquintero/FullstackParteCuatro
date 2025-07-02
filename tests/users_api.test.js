const { describe, test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const assert = require('node:assert')
const bcrypt = require('bcryptjs')

describe('user creation validations', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('fails if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'validpass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.error.includes('username'))
  })

  test('fails if password is too short', async () => {
    const newUser = {
      username: 'shortpass',
      name: 'Short Pass',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.error.toLowerCase().includes('password'))
  })

  test('fails if username is not unique', async () => {
    const user = {
      username: 'existing',
      name: 'Original User',
      password: 'securepass'
    }

    await api.post('/api/users').send(user).expect(201)

    const duplicate = {
      username: 'existing',
      name: 'Duplicate User',
      password: 'anotherpass'
    }

    const result = await api
      .post('/api/users')
      .send(duplicate)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.error.toLowerCase().includes('unique'))
  })

  test('succeeds with a valid and unique username and password', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'secure123'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.username, newUser.username)

    const usersInDb = await User.find({})
    const usernames = usersInDb.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})
