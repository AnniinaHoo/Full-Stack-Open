const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })



//  `mongodb+srv://anniinaheikkila:${password}@cluster0.7dreumf.mongodb.net/noteApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3, 
    required: true,
  },
  number: {
    type: String,
    minlength: 3,
    required: true,
  },

  important: Boolean,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)