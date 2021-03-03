
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/notepadDB", {useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: false });

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Note = mongoose.model("Note", notesSchema);


///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/")

.get(function(req, res){
  Note.find(function(err, foundNotes){
    res.render("index", {
      notes: foundNotes
      });
  });
});


app.route("/new")

.get( function(req, res){
  res.render("new");
})

.post(function(req, res){
  const newNote = new Note({
    title: req.body.title,
    description: req.body.description
  });

  newNote.save(function(err){
    if (!err){
      res.redirect("/");
    } else {
      res.send(err);
    }
  });
 
});



////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/notes/:notesId")

.get(function(req, res){

  Note.findById(req.params.notesId, function(err, foundNote){
    if (!err) {
      res.render("note", {
        title: foundNote.title,
        createdAt: foundNote.createdAt,
        description: foundNote.description
        
      });
    } else {
      res.send("Not found!");
    }
  });
})


.patch(function(req, res){

  Note.update(
    {_id:  req.params.notesId},
    {$set: req.body},
    function(err){
      if(!err){
        res.redirect("/");
      } else {
        res.send(err);
      }
    }
  );
});

app.route("/notes/:id")
.delete(function(req, res){
 
  Note.findOneAndRemove(
    {_id: req.params.id}, 
    function(err){
      if (!err){
        res.redirect("/");
      } else {
        res.send(err);
      }
    }
  );
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});