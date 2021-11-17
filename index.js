const express = require('express')
const app = express()

/*~~~~~~~~~~~~~~~~~~*/

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

// api to get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// api to get one person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})
/*~~~~~~~~~~~~~~~~~~*/
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)