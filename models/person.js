const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
  },
  number: {
    type: String,
    validate: {
      validator: function (number) {
        if (number.length < 8) {
          return false
        }

        const regex = /^\d{2,3}-\d+$/ // Validar que coincida con el patrón correcto, la verdad no sabia como hacerlo asi que me busque esta parte en documentacion y tambien me apoye en IA
        return regex.test(number)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Format should be ##-###### or ###-#######`,
    },
    required: [true, 'User phone number required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
