/* eslint-disable no-undef */
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://alexlepeniotis:${password}@cluster0.m5ejhy4.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length > 3) {
  const personName = process.argv[3];
  const personTel = process.argv[4];

  const person = new Person({
    name: personName,
    number: personTel,
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number: ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      // person.name = person.name;
      console.log(person);
    });
    mongoose.connection.close();
  });
}
