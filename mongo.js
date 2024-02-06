const mongoose = require('mongoose')

const password = process.argv[2]
const url =
  `mongodb+srv://oolongraccoon:${password}@cluster0.xstihwn.mongodb.net/People?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema,'people')

if (process.argv.length === 3) {
  console.log('phonebook:')

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })

    mongoose.connection.close()
    process.exit(1)
  })
}
else{
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(result => {
  
    Person.find({}).then(allpeople => {
      const lastPerson = allpeople[allpeople.length - 1]
      console.log(`added ${lastPerson.name} number ${lastPerson.number} to phonebook`)
      mongoose.connection.close()
    })
  })
}