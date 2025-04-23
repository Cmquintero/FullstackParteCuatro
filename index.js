const express = require("express");
const app = express();
app.use(express.json());
const morgan = require('morgan')
app.use(morgan("tiny"));
morgan.token('request-body',(request)=>{
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :request-body"));

let notes = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Mario Carlos",
    number: "3151451241",
  },
];

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get("/api/persons/", (request, response) => {
  response.send(notes);
});

const info = () => {
  const total = notes.length;
  const date = new Date();
  return `
    <p>Phonebook has info for ${total} people</p>
    <p>${date}</p>
  `;
};
app.get("/api/info", (request, response) => {
  response.send(info());
});

app.get("/api/persons/5", (request, response) => {
  const note = notes.find((n) => n.id === 5);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);//crei que funcionaba igual que el.filter pero en realidad en esta linea busco solo un id mas no creo un array nuevo eliminando el elemento como lo hago en(*)

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
}); 

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);//(*)
  response.send(`The person with id: ${id} has been delete`);
  response.status(204).end();
});
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  if (notes.some(note => note.name === body.name)) {
    return response.status(400).json({
      error: "The name has been exist in the list"
    }); //metodo para el manejo de errores 
  }
  const generateRandomId = () => {
    let id
    do {
      id = Math.round(Math.random() * 1000000)//redonde ya que intente usar el ceil pero falle sin pensar que debia usar era 999999 y use el floor pero me parecia poco util decir si hacia arriba o a abajo
    } while (notes.some(n => n.id === id))
    return id
  }
  const note = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  };
  
  notes = notes.concat(note);

  response.json(note);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});