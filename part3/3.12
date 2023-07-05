const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name_new = process.argv[3]
const number_new = process.argv [4]

const url =
  `mongodb+srv://anniinaheikkila:${password}@cluster0.7dreumf.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  important: Boolean,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length>4) {
  

const person = new Person({
  name: name_new,
  number: number_new,
  important: true,
  })
  
  person.save().then(result => {
  console.log('added ' + name_new + ' number ' + number_new + ' to phonebook')
  mongoose.connection.close()
  })

}

else {

  console.log("phonebook:")
  Person.find({}).then(result => {
    result.forEach(persons => {
    
    console.log(persons.name, persons.number)
    })
    mongoose.connection.close()
    })
  
  }
 



