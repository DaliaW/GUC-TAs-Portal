// Imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const tokenKey = require('./config/keys').secretOrKey;

const Token = require('./models/Token');

//Require Route Handlers
const logIn = require('./routes/logIn');
const attendances = require('./routes/attendances');
const courses = require('./routes/courses');
const departments = require('./routes/departments');
const faculties = require('./routes/faculties');
const locations = require('./routes/locations');
const academicMemberRoutes = require('./routes/academicMembers');
const slots = require('./routes/slots');
const staffMembers = require('./routes/staffMembers');
const requests = require('./routes/requests');
const notifications = require('./routes/notifications');

// Create the app
const app = express();

// Use it with post
app.use(express.json());
app.use(cors());

//Getting Mongo's connection URI
const db = require('./config/keys').mongoURI;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Connecting to MongoDB
const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(db, connectionOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Init middleware
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//seeding
const Tokens = require('./models/Token');
const dummy = require('./helpers/seeding');
// dummy.seedDB();

//All routes should be tested for auth except login
app.use('/logIn', logIn);

app.all('*', async (req, res, next) => {
  try {
    const token = req.header('auth-token');
    // const token = req.headers.token;

    if (token == null) return res.sendStatus(401); // there isn't any token

    const tokenFound = await Token.findOne({ tokenId: token });
    if (tokenFound) {
      if (!tokenFound.valid) {
        return res.sendStatus(401);
      }
    } else {
      return res.send('Sorry no token');
    }

    req.user = jwt.verify(token, tokenKey);
    next();
  } catch (err) {
    console.log('~ err', err);
    res.send({ error: err });
  }
});

app.use('/attendance', attendances);
app.use('/courses', courses);
app.use('/departments', departments);
app.use('/faculties', faculties);
app.use('/locations', locations);
app.use('/academicMember', academicMemberRoutes);
app.use('/slots', slots);
app.use('/staffMembers', staffMembers);
app.use('/requests', requests);
app.use('/notifications', notifications);


app.post('/logOut', async function (req, res) {
  const tokenFound = await Token.findOne({ tokenId: req.header('auth-token') });
  if (tokenFound) {
    if (tokenFound.valid) {
      tokenFound.valid = false;
      await tokenFound.save();
      res.send('Logged out successfully');
    }
  } else {
    res.send('Sorry no token found in db');
  }
});

//simulation of the month
/*
this is a simulation how adding annual balance each month
the server should be running 
showing total number of months since this user register 
and calculating corresponding balance relative to the number and attendance 

if we saved the date the user registered 
only we will be needing to call "updateAnnualBalance" function every month 
*/

// let totalMonths = 0;
// var intervalID = window.setInterval(updateMonth, 5000);

// function updateMonth() {
//     totalMonths += 1;
//     console.log("Total numbers of months so far: ", totalMonths);
// }

//running port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port}`));
