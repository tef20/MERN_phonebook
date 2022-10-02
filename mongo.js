const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://m001-student:${password}@sandbox.rubk0.mongodb.net/phoonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const contactName = process.argv[3] ?? null;
const contactNumber = process.argv[4] ?? null;

const phonebook = mongoose.connect(url).then(() => console.log("connected"));

if (process.argv.length < 5) {
  phonebook
    .then(() => {
      console.log("phonebook:");
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });

        return mongoose.connection.close();
      });
    })
    .catch((err) => console.log(err));
} else {
  phonebook
    .then((result) => {
      const person = new Person({
        name: contactName,
        number: contactNumber,
      });

      return person.save();
    })
    .then((messageArray) => {
      console.log(`added ${contactName} number ${contactNumber} to phonebook`);
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
