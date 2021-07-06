
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


// Load the full build.
var _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// mongodb connection
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true }, { useUnifiedTopology: true } );

//  schema
const blogSchema = mongoose.Schema({
  title: String,
  post: String
})

// model
const Blog = mongoose.model("Blog", blogSchema)

const defaultItems = ["first post"]




app.get("/", (req, res,) => {

Blog.find(function(err, posts) {
  if (err) {
    console.log("error finding posts")
  } else {
    res.render("home", {posts: posts})
  }
})
});



app.get("/about", (req, res) => {
  res.render("about")
});

app.get("/contact", (req, res) => {
  res.render("contact")
});

app.get("/compose", (req, res) => {
  res.render("compose")
});



app.post("/compose", (req, res) => {

  // assinging title & content to a variable
var composeTitle = req.body.titleInput
var content = req.body.textInput
  

//  mongoose model that saves title and post
  const newPost = new Blog({
    title: composeTitle,
    post: content
  });
newPost.save()

// redirects back to the home route
  res.redirect("/")
});




app.get("/posts/:posttitle", (req, res) => { 


  // converts string to lowercase
  const titlename = _.lowerCase(req.params.posttitle)
  
// calls database and finds one with matching title
  Blog.findOne({title: titlename}, function(err, titles) {
    if (titlename === titles) {
      res.render("/posts/" + titlename, {content: titles.post})
      } else {
console.log("successfully saved to database")
        const customPost = new Blog({
          title: titlename,
          post: ""
        })
        customPost.save()
        res.render("post", {title: titles.title, content: titles.post})
      }
      
      
  })



});



app.listen(3000, function() {
  console.log("Server started on port http://localhost:3000");
});
