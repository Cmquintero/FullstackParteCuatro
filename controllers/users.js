const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1
  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body


  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username is required and must be at least 3 characters long'
    })
  }

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password is required and must be at least 3 characters long'
    })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})


usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  try {
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return response.status(404).json({ error: 'user not found' })
    }

    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: 'malformatted id' })
  }
})


usersRouter.delete('/', async (request, response) => {
  try {
    await User.deleteMany({})
    response.status(204).end()
  } catch (error) {
    response.status(500).json({ error: 'Failed to delete users' })
  }
})

module.exports = usersRouter
