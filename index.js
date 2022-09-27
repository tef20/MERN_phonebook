const express = require("express");
const morgan = require("morgan");
const app = express();

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

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12121",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
  {
    name: "aa",
    number: "bb",
    id: 5,
  },
];

const newID = () => Math.max(...persons.map((persons) => persons.id)) + 1;

// app.get("/", (request, response) => {
//   response.send("<h1>Hello</h1>");
// });

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people.</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (!person.name || !person.number) {
    response.status(400);
    response.json({ error: "Contact must include a name and number." });
  } else if (persons.some((existingP) => existingP.name === person.name)) {
    response.status(400);
    response.json({ error: "Contact already exists." });
  } else {
    persons = persons.concat({
      name: person.name,
      number: person.number,
      id: newID(),
    });
    response.json();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
