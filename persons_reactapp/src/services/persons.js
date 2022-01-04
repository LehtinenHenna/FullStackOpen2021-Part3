import axios from 'axios'
const baseUrl = '/api/persons' //used when production build is generated and moved to persons_expressapp to be used from there
//const baseUrl = 'http://localhost:3001/api/persons' //pointing to backend persons_expressapp when reactapp and expressapp are separate
//const baseUrl = 'http://localhost:3001/persons' //pointing to db.json

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}


const personService = {getAll, create, update, remove}
export default personService

// command to start react app: npm start
// command to start json server db.json: npm run server