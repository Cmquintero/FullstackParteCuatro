import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

/*const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
    }*/

const getAll = () => {
  const request = axios.get(baseUrl)
  const nonExisting = {
    content: 'If you import this note, this note doesnt exist in the form',
    important: true,
    }
  return request.then((response) => response.data.concat(nonExisting))
}
   
const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = id => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

export default { getAll, create, update, remove }
//el código que maneja la comunicación con el backend 