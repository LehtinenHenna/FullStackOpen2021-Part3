import React from 'react'

const Notification = ({ message, success}) => {
  if (message === null) {
    return (
      <div className="messagePlaceHolder"></div>
    )
  }
  else if (success === true) {
    return (
      <div className="successMessage">
        {message}
      </div>
    )
  }
  else if (success === false) {
    return (
      <div className="errorMessage">
        {message}
      </div>
    )
  }
}

const DeleteButton = ({handler, id, text}) => {
  return (
    <button onClick={() => handler(id)}>
      {text}
    </button>
  )
}

// creating a form to post a new name and number to the phone book
const PersonForm = ({handleAddPerson, newName, newNumber, handleNameChange, handleNumberChange}) => { 
  return (
      <form onSubmit={handleAddPerson}>
          <div> name: <input value={newName} onChange={handleNameChange}/> </div>
          <div> number: <input value ={newNumber} onChange={handleNumberChange}/> </div>
          <div> <button type="submit">add</button> </div>
      </form>
  )
}


// rendering one person on the screen along with delete button that deletes the person
const PersonRender = ({person, filter, handleDeleteClick}) => {
// making the filtering case-insensitive
  const upperFilter = filter.toUpperCase()
  const upperName = person.name.toUpperCase()
  //return only the names that apply to the filter condition
  if (upperName.includes(upperFilter)) {
      return (
      <li>
        {person.name} {person.number}
        <DeleteButton 
          handler={handleDeleteClick} 
          id={person.id} 
          text='delete'
        />
      </li>
      )
  } else {
      return null
  }    
}
  
// rendering all persons on the screen
const PersonsRender = ({persons, filter, handleDeleteClick}) => {
  return (
      <ul>
        {persons.map(person =>     
          <PersonRender 
          key={person.name} 
          person={person} 
          filter={filter}
          handleDeleteClick={handleDeleteClick}
          /> 
        )}
      </ul>
  )
}
  
// creating an input field to filter results
const Filter = ({filter, handleFilterChange}) => {
  return (
      <div> 
      filter shown with 
      <input value={filter} onChange={handleFilterChange}/>
      </div>
  )
}

export {Filter, PersonsRender, PersonForm, Notification}