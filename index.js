require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
morgan.token('req-body', req => JSON.stringify(req.body))
const Format = ':method :url :status :res[content-length] - :response-time ms :req-body';
app.use(morgan(Format))
app.use(express.json())

const generateId = () => {
  const randomId = Math.floor(Math.random() * 1000000)

  return  randomId
}

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
          response.json(person)
      } else {
          response.status(404).end()
      }
    })
    .catch(error => {
      console.error(error)
      next(error)
    })  
})
app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

  
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }  
  if (body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  } 

  const person = new Person ({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name,number } = request.body
  Person.findByIdAndUpdate(request.params.id,request.body,
    { new: true, runValidators: true, context: 'query' })
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})


app.get('/info', (request, response, next) => {
  Person.countDocuments({})
  .then(people => {
    const info = `Phonebook has info for ${people} people.
    <p></p>
    ${new Date()}`
    response.send(info)
  })
  .catch(error => next(error))

})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 
  else {
    return response.status(500).send({ error: 'Internal Server Error' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})