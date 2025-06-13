const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const assert = require('node:assert')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author One',
    url: 'https://firstblog.com',
    likes: 5,
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'https://secondblog.com',
    likes: 10,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 2)
})



test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New async blog',
    author: 'Tester',
    url: 'https://newblog.com',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(b => b.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('New async blog'))
})
after(async () => {
  await mongoose.connection.close()
})