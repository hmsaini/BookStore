var express = require('express');
var router = express.Router();

var Book=require('../models/bookModel');
var Category=require('../models/categoryModel');

// books
router.get('/', function(req, res, next) {
    // :3000/books -->redirect to home page
  res.render('index', { title: 'BookStore' });  
});

router.get('/details/:id',function(req,res,next){
  Book.findOne({_id:req.params.id},function(err,book){
if(err){
  console.log(err);
}

var model={
  book:book
};
res.render('books/details',model);
  });

});


module.exports = router;