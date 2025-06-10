const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) =>
    console.error('error connecting to MongoDB:', error.message)
  )


const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minLength: [4, 'Title min 4 characters long'],
  },
  author: {
    type: String,
    required: [true, 'author is required'],
    minLength: [4, 'author name min 4 letters '],
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
    validate: {
      validator: function (value) {
        return value.startsWith('https://')
      },
      message: (props) => `${props.value} must start with 'https://'`,
    },
  },
  upvoted: {
    type: Number,
    required: true,
    min: [1, 'upvoted must be 1 or more '],
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)