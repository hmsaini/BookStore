var express = require('express');
var router = express.Router();

var Book = require('../models/bookModel');



/* GET home page. */
router.get('/', function (req, res, next) {
  var db = req.db;
  // connect with books collection
  var books = db.collection('books');  
  // find everything from books collection
  Book.find({}, {}, function (err, books) {
    if (err) {
      console.log(err);
    }
    books.forEach(function(book){
book.truncText=book.truncText(50);
    });
    res.render('index', {
      "books": books                      // model
    });
  });
});

module.exports = router;