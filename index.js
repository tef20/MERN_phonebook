const express = require("express");
const app = express();

app.use(express.json());

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

app.get("/", (request, response) => {
  response.send("<h1>Hello</h1>");
});

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
  console.log(persons);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (
    person.name &&
    person.number &&
    !persons.some((p) => p.name === person.name)
  ) {
    console.log([person.name, person.number]);
    persons = persons.concat({
      name: person.name,
      number: person.number,
      id: newID(),
    });
    response.json();
  } else {
    response.status(400).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
