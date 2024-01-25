require("dotenv").config({ path: "./a.env" });

const express = require("express");
const app = express();
const morgan = require("morgan"); // Logger
const Person = require("./models/person");
const cors = require("cors"); // Cors policy, npm install cors
const { Model } = require("mongoose");

morgan.token("req", function getId(req) {
  console.log(req.body);
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :req")
); // format of logging in console
app.use(cors());
app.use(express.static("dist")); // use dist from frontend build

//API Start

// GET ALL
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// GET BY ID
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      return response.json(person);
    } else {
      return response.status(404).end();
    }
  });
});

//GET INFO
app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                       <p>${Date().toLowerCase()}</p>`);
  });
});

// POST
app.post("/api/persons", (request, response) => {
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
      return response.json(person);
    })
    .catch((error) => {
      console.log("Error updating note:", error);
      response.status(500).json({ error: "Internal Server Error" });
    });
});

//PUT
app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const id = request.params.id;
  if(body.name === undefined){
    return response.status(400).json({ error: 'name missing'});
  }

  const update = {
    id: id,
    name: body.name,
    number: body.number
  };

  Person.updateOne({_id: id}, update)
    .then(() => {
        response.json(update);
    })
    .catch((error) => {
      console.log('Error updating person:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    })  
  
});

// DELETE
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.deleteOne({ _id: id })
  .then((result) => {
    if (result.deletedCount > 0) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: "Not Found" });
    }
  })
  .catch((error) => {
    console.log("Error deleting document:", error);
    response.status(500).json({ error: "Internal Server Error" });
  });
});

// API END

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
