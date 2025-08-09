require("dotenv").config();
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  favoriteFoods: [String],
});

let Person = mongoose.model("Person", personSchema);

const handleData = (done, err, data) => {
  if (err) return console.error(err);
  done(null, data);
};

const savePerson = (data, done) => {
  let person = new Person(data);

  person.save(function (err, data) {
    handleData(done, err, data);
  });
};

const createAndSavePerson = (done) => {
  savePerson(
    {
      name: "Peter",
      age: 24,
      favoriteFoods: ["Pizza"],
    },
    done
  );
};

const createManyPeople = (arrayOfPeople, done) => {
  arrayOfPeople.forEach((person) => {
    savePerson(person, done);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function (err, data) {
    handleData(done, err, data);
  });
};

const findBy = (query, done) => {
  Person.findOne(query, function (err, data) {
    handleData(done, err, data);
  });
};

const findOneByFood = (food, done) => {
  findBy({ favoriteFoods: food }, done);
};

const findPersonById = (personId, done) => {
  findBy({ _id: personId }, done);
};

// Old way of doing find-update
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findOne({ _id: personId }, function (err, person) {
    if (err) return console.error(err);
    person.favoriteFoods.push(foodToAdd);
    person.save(function (err, data) {
      handleData(done, err, data);
    });
  });
};

// New way of doing find-update
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    {
      name: personName,
    },
    {
      age: ageToSet,
    },
    {
      new: true,
      runValidators: true,
    },
    function (err, data) {
      handleData(done, err, data);
    }
  );
};

const removeById = (personId, done) => {
  Person.findOneAndRemove(
    {
      _id: personId,
    },
    function (err, data) {
      handleData(done, err, data);
    }
  );
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove(
    {
      name: nameToRemove,
    },
    function (err, data) {
      handleData(done, err, data);
    }
  );
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ food: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: false })
    .exec((err, data) => {
      handleData(done, err, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
