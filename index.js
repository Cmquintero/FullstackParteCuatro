const express = require("express");
const app = express();
app.use(express.json())

let notes =[
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
  },
  {
    id:5,
    name:"Mario Carlos",
    number: "3151451241",
  }
]



app.get("/api/persons/", (request, response) => {
  response.send(notes);
});

const info = () => {
  const total = notes.length;
  const date = new Date();
  return `
    <p>Phonebook has info for ${total} people</p>
    <p>${date}</p>
  `
};
app.get("/api/info", (request, response) => {
  response.send(info());
});

app.get("/api/persons/5", (request, response) => {
  const note = notes.find(n => n.id === 5);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
