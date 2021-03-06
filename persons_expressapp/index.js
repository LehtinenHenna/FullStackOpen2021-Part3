require('dotenv').config() // dotenv allows you to have environment variables loaded from .env file into process.env. The .env file can be gitignored so the variables don't end up in github
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

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
  Person.find({}).then(persons => {
    const message = `Phonebook has info for ${persons.length} people`
    const date = new Date()
    response.send(
      `<p>${message}</p>
      <p>${date}</p>`
    )
  })

})


// api to get all persons from MongoDB
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


// api to get one person by id from MongoDB
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


// api to delete a person by id from MongoDB
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// api to post a person to MongoDB, validation is done in personSchema in models/person.js
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})


// api to modify a person's information to MongoDB. Validation is not being done at this point.
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
/*~~~~~~~~~~~~~~~~~~*/

// middleware to handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


// middleware to handle errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

/*~~~~~~~~~~~~~~~~~~*/
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


// command to start backend dev server: npm run dev