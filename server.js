// Lesson-10
// The Confessions Server
const DATABASE_DSN = process.env.MONGODB_URI ||'mongodb://localhost:27017/testDB';
const PORT =process.env.PORT || 8080;
 
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs(DATABASE_DSN, ['confessions']);
var cors = require('cors');
 
app.use(cors({credentials:true, orgin:true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.get('/', function(req, res) {
  res.send({'status': 'success', 'message': 'Hello World!'});
});
 
// Get all confessions
app.get('/confessions', function (req, res) {
  db.confessions.find(function (err, docs) {
    res.send({'status': 'success', 'confessions': docs});
  });
});
 
// Get single confession
app.get('/confession/:id', function(req, res) {
  db.confessions.find({id: req.params.id},
    function(err, docs) {
      res.send({'status': 'success', 'confession': docs[0]});
    }
  );
});
 
// Creation of Confession
app.post('/confession', function(req, res) {
  var name = req.body.name;
  var message = req.body.message;
 
  if(message != null) {
    // Set default value of name
    if(name == null || name.length == 0) {
      name = "Anonymous";
    }
    // Insert confession into database
    db.confessions.insert({
      name: name,
      message: message
    });
    // Return success
    res.send({'status': 'success'});
  } else {
    res.send({'status': 'error', 'message': 'Missing message'});
  }
});
 
app.listen(PORT, function () {
  console.log('My express server is running on port ' + PORT + "!");
});