require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

/*~~~~~~~~~~~~~~~~~~*/

/*
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]
*/
/*~~~~~~~~~~~~~~~~~~*/

app.use(express.json())
app.use(cors()) // middleware to allow reactapp to fetch data from backend
app.use(express.static('build')) // middleware so that index.html from build is displayed at 

// morgan middleware logs request data in the console
app.use(morgan((tokens,req, res) => {
  let tokensList = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    ]
  
  let body = req.body
  body = JSON.stringify(body)
  
  if (body !== '{}') {
    // creating a new token that can be called with tokens.body(req, res)
    morgan.token('body', () => body)
    tokensList.push(tokens.body(req, res))
  }

  return tokensList.join(' ')
}))
/*~~~~~~~~~~~~~~~~~~*/

// api to get the info page
app.get('/info', (request, response) => {
  const message = `Phonebook has info for ${persons.length} people`
  const date = new Date()
  response.send(
    `<p>${message}</p>
    <p>${date}</p>`
  )
})

// api to get all persons (using MongoDB)
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// api to get one person (using MongoDB)
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// api to delete a person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

/*
// function to generate a unique id
const generateId = () => {
  let id = null 
  do {
    id = Math.floor( Math.random() * 100 )// generates random integer between 0 and 100
    console.log('id:', id)
  }
  while (persons.find(person => person.id === id)) // generate new id if it's already taken

  return id
}
*/

// api to post a person
app.post('/api/persons', (request, response) => {
  const body = request.body

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  // require both name and number
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  // if name is already in the phone book request is denied
  } else if (persons.find(person => person.name === newPerson.name)) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

/*~~~~~~~~~~~~~~~~~~*/
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// command to start backend dev server: npm run dev