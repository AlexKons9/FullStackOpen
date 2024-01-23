const express = require('express');
const app = express();
const morgan = require('morgan'); // Logger
const cors = require('cors'); // Cors policy, npm install cors

morgan.token('req', function getId (req) {
    console.log(req.body)
    return JSON.stringify(req.body)
  })

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req')); // format of logging in console
app.use(cors());
app.use(express.static('dist')); // use dist from frontend build

var persons = [
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
    }
];

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    var id = Number(request.params.id);
    var person = persons.find(p => p.id === id);
    if (person) {
        return response.json(person);
    }
    else {
        return response.status(404).end();
    }
});

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                   <p>${Date().toLowerCase()}</p>`);
}); 

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if(!body.name) {
        return response.status(400).json({
            error: 'Name missing'
        });
    }

    var person = {
        name: body.name,
        number: Number(body.number),
        id: Math.max(...persons.map(p => p.id)) + 1
    }

    persons = persons.concat(person);
    return response.json(person);
}); 

app.delete("/api/persons/:id", (request ,response) => {
    var id = Number(request.params.id);
    var person = persons.find(x => x.id === id);

    if(person) {
        persons = persons.filter(p => p.id !== id);
        response.status(204).end();
    } else {
        response.status(404).end();
    }
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});