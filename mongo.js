const mongoose = require("mongoose");

if (process.argv.length < 5) {
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

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    return person.save();
  })
  .then(() => {
    console.log("person saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));