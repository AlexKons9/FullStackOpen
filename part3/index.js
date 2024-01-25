require('dotenv').config({path:'./a.env'})
const express = require("express");
const app = express();
const Note = require('./models/note')
const cors = require('cors')

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

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static('dist'));

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0
  return maxId + 1
}

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
});

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  })
});

app.post("/api/notes", (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
});

app.put("/api/notes/:id", (request, response) => {
  // const id = Number(request.params.id);
  // const note = notes.find((note) => note.id === id);
  const body = request.body
  
  if (body) {
    Note.updateOne(body).then((note) => {
      response.json(note);
  
    })
    // note.content = body.content;
    // note.important = Boolean(body.important) || false;
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((x) => x.id == id);
  notes = notes.filter((note) => note.id !== id);

  if (note) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.use(unknownEndpoint);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
