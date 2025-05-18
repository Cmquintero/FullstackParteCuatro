const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://cmquinterot:${password}@cluster0.4pro2ho.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)




/*note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/

const Person = mongoose.model('Person')
if (process.argv.length === 3) {

  Person.find({}).then(result => {
    console.log('Persons:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to persons`)
    mongoose.connection.close()
  })
}
