const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');

const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/kindling', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const personSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    gender: String,
    description: String,
    reviews: [{
        author: String,
        text: String,
        date: String
    }],
    reviewsCount: Number,
    path: String,
});
  
// Create a model for items in the museum.
const Person = mongoose.model('Person', personSchema);
  
// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    // Just a safety check
    if (!req.file) {
        return res.sendStatus(400);
    }
    res.send({
        path: "/images/" + req.file.filename
    });
});

/** Registers a person and their account, checks for already used username */
app.post('/api/register', async (req, res) => {
    const person = new Person({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        description: req.body.description,
        reviews: Array(),
        reviewsCount: 0,
        path: req.body.path,
    });
    try {
        let personE = await Person.findOne({
            username: req.body.username,
        }, { password: 0 });
        if(personE == null){
            await person.save();
            let personSecure = await Person.findOne({
                _id: person._id
            }, { password: 0 });
            res.send(personSecure);
        } else {
            res.send({ message: "Username is already taken!" });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/** Logins a person in by username and password */
app.post('/api/login', async (req, res) => {
    try {
        let person = await Person.findOne({
            username: req.body.username,
            password: req.body.password,
        }, { password: 0 });
        if(person != null){
            res.send(person);
        } else {
            res.send({ message: "Username or password is incorrect!" });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/** Gets all the people in the database */
app.get('/api/persons', async (req, res) => {
    try {
        let persons = await Person.find({},{
            username: 0, email: 0, password: 0 });
        res.send(persons);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

/** Gets a single person by ID */
app.get('/api/persons/:id', async (req, res) => {
    try {
        let person = await Person.findOne({
            _id: req.params.id
        }, { username: 0, email: 0, password: 0 });
        res.send(person);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

/** Deletes a single person by ID */
app.delete('/api/persons/:id', async (req, res) => {
    try{
        await Person.deleteOne({
            _id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/** Updates any edits to the description or email of a person by ID */
app.put('/api/persons/:id', async (req, res) => {
    try {
        let person = await Person.findOne({
            _id: req.params.id
        }, { password: 0 });
        person.description = req.body.description;
        person.email = req.body.email;
        await person.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/** Adds a review to a person's profile but ID */
app.put('/api/reviews/:id', async (req, res) => {
    try {
        let review = req.body.review
        let person = await Person.findOneAndUpdate({
            _id: req.params.id
        }, {
            $push: { reviews: review }
        }, { password: 0 });
        person.reviewsCount += 1;
        await person.save();
        let updatedPerson = await Person.findOne({
            _id: person._id
        }, {password: 0});
        res.send(updatedPerson);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3001, () => console.log('Server listening on port 3001!'));