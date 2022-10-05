require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.static("build"));
app.use(express.json());
morgan.token("customCont", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    `:method :url :status :res[content] - :response-time ms Contents: :customCont`
  )
);

app.get("/info", (request, response) => {
  return response.send(
    `<p>Phonebook has info for ${
      initialPersons.length
    } people.</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  return Person.find({}).then((res) => {
    response.send(res);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  Person.findById(id).then((person) => {
    if (!person) return response.status(404).end();
    return response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  Person.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => console.log("ERROR HERE", error));
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (!person.name || !person.number) {
    return response
      .status(400)
      .json({ error: "Contact must include a name and number." });
  }

  // if (initialPersons.some((existingP) => existingP.name === person.name)) {
  //   return response.status(400).json({ error: "Contact already exists." });
  // }

  const newContact = new Person({
    name: person.name,
    number: person.number,
    // id: newID(),
  });

  newContact.save().then((savedContact) => {
    return response.json(savedContact);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
