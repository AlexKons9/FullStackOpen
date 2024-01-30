// Require Statements
require("dotenv").config({ path: "./a.env" });

const express = require("express");
const app = express();
const morgan = require("morgan"); // Logger
const Person = require("./models/person");
const cors = require("cors"); // Cors policy, npm install cors

morgan.token("req", function getId(req) {
  console.log(req.body);
  return JSON.stringify(req.body);
});

// Logging middleware to log additional information if needed
const requestLogger = (request, response, next) => {
  next(); // Call next to pass control to the next middleware
};

// Middleware setup
app.use(express.json());
app.use(morgan("Api Log: :method :url :status :res[content-length] - :response-time ms :req"));
app.use(requestLogger);
app.use(cors());
// app.use(express.static("dist")); // use dist from frontend build



// API Start

// GET ALL
app.get("/api/persons", (request, response, next) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  })
  .catch((error) => next(error));
});

// GET BY ID
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      return response.json(person);
    } else {
      return response.status(404).end();
    }
  })
  .catch((error) => next(error));
});

// GET INFO
app.get("/info", (request, response, next) => {
  Person.find({}).then((persons) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                       <p>${Date().toLowerCase()}</p>`);
  })
  .catch((error) => next(error));
});

// POST
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({
      error: "Name missing",
    });
  }

  var person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      return response.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

// PUT
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body
  const id = request.params.id;

  Person.findByIdAndUpdate(
      {_id: id}, 
      {name, number},
      { new: true, runValidators: true, context: 'query' }
    )
    .then((updatedContact) => {
        response.json(updatedContact);
    })
    .catch((error) => next(error));
});

// DELETE
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.deleteOne({ _id: id })
  .then((result) => {
    if (result.deletedCount > 0) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: "Not Found" });
    }
  })
  .catch((error) => next(error));
});

// API END

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log(error);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error);
};

app.use(errorHandler);

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
