const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')

// GET todos los blogs
blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

    const formattedBlogs = blogs.map(blog => ({
      url: blog.url,
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
      idBlog: blog._id.toString(),
      user: {
        username: blog.user?.username,
        name: blog.user?.name,
        id: blog.user?._id.toString()
      }
    }))

    response.json(formattedBlogs)
  } catch (error) {
    next(error)
  }
})

// GET un blog por id
blogRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', {
      username: 1,
      name: 1,
    })

    if (!blog) return response.status(404).end()

    response.json({
      url: blog.url,
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
      idBlog: blog._id.toString(),
      user: {
        username: blog.user?.username,
        name: blog.user?.name,
        id: blog.user?._id.toString()
      }
    })
  } catch (error) {
    next(error)
  }
})

// POST nuevo blog
blogRouter.post('/', async (request, response, next) => {
  try {
    const { author, title, url, likes } = request.body
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'user not authenticated' })
    }

    if (!author || !title || !url) {
      return response.status(400).json({ error: 'author, title, or url is missing' })
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
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

    response.status(201).json({
      url: populatedBlog.url,
      title: populatedBlog.title,
      author: populatedBlog.author,
      likes: populatedBlog.likes,
      idBlog: populatedBlog._id.toString(),
      user: {
        username: populatedBlog.user?.username,
        name: populatedBlog.user?.name,
        id: populatedBlog.user?._id.toString()
      }
    })
  } catch (error) {
    next(error)
  }
})

// PUT actualizar blog
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
    ).populate('user', { username: 1, name: 1 })

    if (!result) return response.status(404).end()

    response.json({
      url: result.url,
      title: result.title,
      author: result.author,
      likes: result.likes,
      idBlog: result._id.toString(),
      user: {
        username: result.user?.username,
        name: result.user?.name,
        id: result.user?._id.toString()
      }
    })
  } catch (error) {
    next(error)
  }
})

// DELETE blog por ID (solo si el usuario lo creó)
blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'user not authenticated' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'only the creator can delete this blog' })
    }

    await blog.deleteOne()
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// DELETE todos los blogs (opcional)
blogRouter.delete('/', async (request, response) => {
  try {
    await Blog.deleteMany({})
    response.status(204).end()
  } catch (error) {
    response.status(500).json({ error: 'Failed to delete blogs' })
  }
})

module.exports = blogRouter
