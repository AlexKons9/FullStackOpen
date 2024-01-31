// Therefore, the correct order of middleware and route definitions is:

// 1.Require Statements
// 2.Middleware setup.
// 3.Route definitions.
// 4.Error handling middleware.
// 5.Handling unknown endpoints.
// 6.Server initialization.

// Require Statements
require("dotenv").config({ path: "./a.env" });

// Express and other module imports
const express = require("express");
const app = express();
const Note = require("./models/note");
const cors = require("cors"); //npm install cors

// Middleware setup
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.static("dist")); // Serve static files from the 'dist' directory

// Logging middleware to log incoming requests
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

// Define route handlers
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  console.log(error);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Server initialization
const PORT = process.env.PORT; // Get the port from environment variables
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
