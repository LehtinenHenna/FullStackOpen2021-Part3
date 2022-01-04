import React, { useState, useEffect } from 'react'
import {PersonForm, PersonsRender, Filter, Notification} from './components/Person.js'
import personService from './services/persons.js'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ success, setSuccess ] = useState(true)


  // fetching data from server and saving that data to persons
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const handleAddPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    // check if the name already exists in the phone book (case-insensitive)
    const samePerson = persons.find(person => person.name.toUpperCase() === personObject.name.toUpperCase())
    if (samePerson) {
      // if the person exists but the phone number is different update number after confirmation
      if (samePerson.number !== personObject.number) {
        const confirm = window.confirm(`${samePerson.name} is already added to the phonebook, replace old number with a new one?`)
        if (confirm === true) {
          personService
            .update(samePerson.id, personObject)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== samePerson.id ? person : returnedPerson))
              setNewName('')
              setNewNumber('')
              setSuccess(true)
              setMessage(`${personObject.name}'s phone number updated successfully`)
              setTimeout(() => {
                setMessage(null)
              }, 4000)
            })
            // catch the error in case the person was deleted before the update went through
            .catch(error => {
              setPersons(persons.filter(p => p.id !== samePerson.id))
              setSuccess(false)
              setMessage(`${personObject.name} was already deleted from the phone book`)
              setTimeout(() => {
                setMessage(null)
              }, 4000)
            })
        }
      }
      else {
        setSuccess(false)
        setMessage(`${newName} is already added to the phonebook.`)
        setTimeout(() => {
          setMessage(null)
        }, 4000)
      }  
    }
    // check if the input phone number is really a number 
    else if (isNaN(personObject.number)) {
      setSuccess(false)
      setMessage(`${newNumber} is not a valid phone number.`)
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    }
    // check that the name or number is not left blank
    else if (personObject.name === '' || personObject.number === '') {
      setSuccess(false)
      setMessage(`Please add a name and a number.`)
      setTimeout(() => {
        setMessage(null)
      }, 4000)
    }
    // if the person doesn't exist yet, has a name and the number is a number let's add personObject to the phone book 
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccess(true)
          setMessage(`${personObject.name} added to the phonebook`)
          setTimeout(() => {
            setMessage(null)
          }, 4000)
        }) 
    } 
  }

  const handleNameChange = (event) => {
    // event.target.value contains whatever is written in the corresponding input box at the moment
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDeleteClick = (id) => { 
    const confirm = window.confirm("Are you sure you want to delete this person?")
    if (confirm === true) {
      const personToDelete = persons.find(person => person.id === id)
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setSuccess(true)
          setMessage(`${personToDelete.name} successfully deleted`)
          setTimeout(() => {
            setMessage(null)
          }, 4000)
        })
    }
  }

  return (
    <div>
      <h1> Phonebook </h1>
      <Notification 
        message={message}
        success={success}
      />
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange}
      />
      <h2> Add a new </h2>
      <PersonForm 
        handleAddPerson={handleAddPerson} 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange}
      />
      <h2> Numbers </h2>
      <PersonsRender 
        persons={persons} 
        filter={filter} 
        handleDeleteClick={handleDeleteClick}
      />   
    </div>
  )
}


export default App

// start react app: npm start
// start json server: npm run server