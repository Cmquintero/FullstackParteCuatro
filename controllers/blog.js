const blogRouter = require('express').Router()
const Blog = require('../models/blogs')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    console.log(`GET /api/blogs - returned ${blogs.length} blogs`)
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', async (request, response, next) => {
  try {
    const { author, title, url, likes } = request.body

    if (!author || !title || !url) {
      return response.status(400).json({ error: 'author, title or url are missing' })
    }

    const existing = await Blog.findOne({ title }) 
    if (existing) {
      return response.status(400).json({ error: 'The blog already exists in the database' })
    }

    const blog = new Blog({
      author,
      title,
      url,
      likes: likes ?? 0, 
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})


blogRouter.put('/:id', async (request, response, next) => {
  try {
    const { author, title, url, likes } = request.body

    const updatedBlog = {
      author,
      title,
      url,
      likes,
    }

    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      updatedBlog,
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    )

    if (result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
