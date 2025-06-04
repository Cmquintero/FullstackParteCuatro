const mongoose = require('mongoose')
const Blog = require('./models/blogs')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const author = process.argv[3]
const title = process.argv[4]
const link = process.argv[5]
const like = process.argv[6]

const url = `mongodb+srv://cmquinterot:${password}@cluster0.uchl0hj.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      return Blog.find({}).then(result => {
        console.log('Blogs:')
        result.forEach(blog => {
          console.log(`${blog.author} - ${blog.title} (${blog.like} likes)\n${blog.link}`)
        })
        return mongoose.connection.close()
      })
    } else {
      const blog = new Blog({ author, title, link, like })

      return blog.save().then(() => {
        console.log(`Added blog "${title}" by ${author} with link "${link}" and ${like} likes`)
        return mongoose.connection.close()
      })
    }
  })
  .catch(err => {
    console.error('Error:', err.message)
    mongoose.connection.close()
  })