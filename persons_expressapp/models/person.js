const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {    
    console.log('connected to MongoDB')  
  })  
  .catch((error) => {    
    console.log('error connecting to MongoDB:', error.message)  
  })

// Schema for defining the model
const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

// reformatting the data fetched from DB so that: 
// _id is converted from object to string and is renamed as id so as to be compatible with frontend 
// __v is disregarded
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)