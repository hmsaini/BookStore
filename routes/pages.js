var express = require('express');
var router = express.Router();

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');


/* GET pages listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/about', function (req, res, next) {
  res.render('pages/about');
});

router.get('/cart', function (req, res, next) {
  // Get cart from session
  var cart = req.session.cart;
  var displayCart = {
    items: [],
    total: 0
  }
  var total = 0;

  // get total
  for (var item in cart) {
    displayCart.items.push(cart[item]);
    total += ( cart[item].price);
  }
  displayCart.total = total;

  // render cart
  res.render('cart/index', {
    cart: displayCart
  });

});

router.post('/cart/:id', function (req, res, next) {
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;

  Book.findOne({
    _id: req.params.id
  }, function (err, book) {
    if (err) {
      console.log(err);
    }
   

    if (cart[req.params.id]) {
      cart[req.params.id].qty++;
      cart[req.params.id].price=book.price+cart[req.params.id].price;
    }
     else {
      cart[req.params.id] = {
        item: book._id,
        title: book.title,
        price: book.price,
        qty: 1
      }
    }
    res.redirect('/pages/cart');
  });
});


router.get('/cart/remove', function (req, res, next) {
  var cart = req.session.destroy();
  res.redirect('/pages/cart');
});



module.exports = router;