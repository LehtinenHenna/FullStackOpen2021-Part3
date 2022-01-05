/*This file allows you to post a new person to the phone book or 
get all phone book data when this program is run with command line arguments.

to get all phone book data, type command: 
$ node mongo.js <password> 

to post a new person and their number to the phone book, type command:
$ node mongo.js <password> <name> <number>
*/

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://phonebook_admin:${password}@cluster0.hz6iz.mongodb.net/person-app?retryWrites=true&w=majority`
  
mongoose.connect(url)

// create the schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
// create the model based on the schema
const Person = mongoose.model('Person', personSchema)


// if name and number were given as command line arguments
// e.g. node mongo.js <password> "Arto Hellas" 05246463666
if (process.argv.length === 5) {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const person = new Person({
    name: newName,
    number: newNumber
  })
  person.save().then(result => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  }) 
}

// if only password was given as command line argument
// e.g. node mongo.js <password>
else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
else {
  console.log('wrong number of arguments.')
  mongoose.connection.close()  
}
