//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const lodash = require('lodash');
const homeStartingContent =
  'Hello there nice to see you at my blog post feel free to go through my blog ';
const aboutContent =
  'Hello there my name is Lee . I made this blog to post some of my daily life updates feel free to read them as it says in home page. I am a student at a particular university pursuing computer science . So thats pretty much it about myself';
const contactContent =
  'Hello There feel free to mail me at the following email : leeparker0910@gmail.com';

//connect with the database
mongoose.connect(
  'mongodb+srv://itsleeparker:IloveAnime1@cluster0.hsb2p.mongodb.net/blogPosts',
);

//set the schema
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model('blog', blogSchema);
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//set the home route
app.get('/', function(req, res) {
  Blog.find((err, posts) => {
    res.render('home', {
      content: homeStartingContent,
      post: posts,
    });
  });
});

//set the dynamic address for each task
app.get('/post/:topic', (req, res) => {
  //The :topic is actually a parameter which is used to get the paramerer from browser and then render page according to the data
  const topic = req.params.topic; //lodash lowerCase will get rid of any extra hypens or any other unesscary data
  Blog.findById(topic, (err, posts) => {
    if (!err) {
      res.render('post', {
        title: posts.title,
        content: posts.content,
      });
    }
  });
});

//look for any posts at compose route
app.post('/compose', function(req, res) {
  const post = new Blog({
    title: req.body.title,
    content: req.body.content,
  });
  post.save(err => {
    if (!err) {
      console.log('Blog Saved');
      res.redirect('/');
    }
  });
});

//Set route for the about page
app.get('/about', function(req, res) {
  res.render('about', {
    content: aboutContent,
  });
});

//set route for contact page
app.get('/contact', function(req, res) {
  res.render('contact', {
    content: contactContent,
  });
});

//set route for compose page
app.get('/compose', function(req, res) {
  res.render('compose');
});

let port = process.env.PORT;
if (port == '' || port == null) {
  port = 3000;
}

app.listen(port, function() {
  console.log('Server started on ' + port);
});
