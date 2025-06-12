const { request } = require('express')
const Blog = require('../models/blogs')
const blogRouter = require('express').Router()

// GET all blogs
blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => response.json(blogs))
})
// GET blog by ID
blogRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// POST new blog
blogRouter.post('/', (request, response, next) => {
  console.log('Body in:', request.body)

  const body = request.body

  if (!body.author || !body.title || !body.link || body.likes === undefined) {
    return response
      .status(400)
      .json({ error: 'author, title, link or upvote are missing' })
  }

  Blog.findOne({ title: body.title })
    .then((existing) => {
      if (existing) {
        return response
          .status(400)
          .json({ error: 'The blog already exists in the database' })
      }

      const blog = new Blog({
        author: request.body.author,
        title: request.body.title,
        link: request.body.link,
        likes: request.body.likes,
      })
      blog
        .save()
        .then((savedBlog) => response.json(savedBlog))
        .catch((error) => next(error))
    })
    .catch((error) => next(error))
})

// PUT update blog by ID
blogRouter.put('/:id', (request, response, next) => {
  const { author, title, link, likes } = request.body

  const updatedBlog = {
    author,
    title,
    link,
    likes,
  }

  Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// DELETE blog by ID
blogRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
})

module.exports = blogRouter
