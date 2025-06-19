const Blog = require('../models/blogs')

const initialBlogs = [
  {
    title: 'Fir blog',
    author: 'Author OneHundred',
    url: 'https://firstblog.com',
    likes: 5,
  },
  {
    title: 'Sec blog',
    author: 'Author Tre',
    url: 'https://secondblog.com',
    likes: 10,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Temp title',
    author: 'Temp author',
    url: 'http://temp.com',
    likes: 0
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb
}
