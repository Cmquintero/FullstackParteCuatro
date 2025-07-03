const { describe, test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const User = require('../models/user')
const assert = require('node:assert')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const getTokenForTestUser = async () => {
  const user = await User.findOne({ username: 'testuser' })

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  return {
    token: jwt.sign(userForToken, process.env.SECRET),
    user,
  }
}

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(b => new Blog(b))
  const promiseArray = blogObjects.map(b => b.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of the blog is named idBlog', async () => {
  const response = await api.get('/api/blogs')
  assert.ok(response.body.length > 0, 'No blogs returned')
  assert.ok(response.body[0].idBlog, 'idBlog property is missing')
})

describe('when a blog is added with a user', () => {
  let testUserId

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'testuser', passwordHash })
    const savedUser = await user.save()
    testUserId = savedUser._id.toString()

    await Blog.deleteMany({})
  })

  test('a valid blog can be added and is saved correctly', async () => {
    const { token } = await getTokenForTestUser()

    const newBlog = {
      title: 'New async blog',
      author: 'Tester',
      url: 'https://newblog.com',
      likes: 7,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('New async blog'))
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const { token } = await getTokenForTestUser()

    const blogWithoutLikes = {
      title: 'No likes blog',
      author: 'Auto Default',
      url: 'https://nolikes.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without required fields is not added', async () => {
    const { token } = await getTokenForTestUser()

    const invalidBlog = {
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 0)
  })
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(resultBlog.body.idBlog, blogToView.id)
  assert.strictEqual(resultBlog.body.title, blogToView.title)
  assert.strictEqual(resultBlog.body.author, blogToView.author)
  assert.strictEqual(resultBlog.body.url, blogToView.url)
  assert.strictEqual(resultBlog.body.likes, blogToView.likes)
})

test('a blog can be deleted by its creator', async () => {
  const { token, user } = await getTokenForTestUser()

  const blog = new Blog({
    title: 'Blog to delete',
    author: 'Carlos',
    url: 'https://delete.com',
    user: user._id,
  })
  await blog.save()

  await api
    .delete(`/api/blogs/${blog._id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes('Blog to delete'))
})

test('blog without title is not added and returns 400', async () => {
  const { token } = await getTokenForTestUser()

  const blogMissingTitle = {
    author: 'Sin título',
    url: 'https://example.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogMissingTitle)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added and returns 400', async () => {
  const { token } = await getTokenForTestUser()

  const blogMissingUrl = {
    title: 'Sin URL',
    author: 'Autor X',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogMissingUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be updated with new likes count', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 10,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
})

describe('user creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})
