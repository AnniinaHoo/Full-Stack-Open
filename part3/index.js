require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express ()


const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(requestLogger)



let persons = [

]

app.get('/api/persons', (req, res) => {

  Person.find({}).then(persons => {
    res.json(persons)
  })

})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(person => {

    if(person) {

    res.json(person)

    }

    else {

      response.status(404).end()
    }
  })
  .catch (error => next(error))
  
})


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
  .then (result => {

    response.status(204).end()

  })

  .catch (error => next (error))
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number, id} = request.body

  Person.findByIdAndUpdate(request.params.id, 
    {name, number, id},
    {new: true, runValidators: true, context: 'query'}
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body);
 

  const getRandomInt = (max) => 

  { 

    return Math.floor(Math.random() * max)
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
    id: getRandomInt(1000)
  })

 person.save().then(newPerson => { 
  
  response.json(newPerson)
  
 })

 .catch(error => next(error))

 
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })

  }

  app.use(unknownEndpoint)




  const errorHandler = (error,request,response,next) => {

    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === "ValidationError") {
    return response.status(400).json ({error: error.message})
  }

 next (error)
  
}


app.use (errorHandler)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })