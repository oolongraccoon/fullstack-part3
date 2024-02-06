const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
morgan.token('req-body', req => JSON.stringify(req.body))
const Format = ':method :url :status :res[content-length] - :response-time ms :req-body';
app.use(morgan(Format))
app.use(express.json())

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  
  })
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
const generateId = () => {
    const randomId = Math.floor(Math.random() * 1000000)

    return  randomId
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
     
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
        return response.status(400).json({ 
        error: 'number missing' 
        })
      }  
    if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
        error: 'name must be unique'
    })
    }
    const person = {
      name: body.name,
      number: body.number,
 
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
app.get('/info', (request, response) => {
    const info =  `Phonebook has info for ${persons.length} people.
    <p></p>
    ${new Date()}`
    response.send(info)
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})