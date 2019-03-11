var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var db = mongoose.connection;

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');
var Manager = require('../models/manager');

router.get('/', function (req, res, next) {
  var sess = req.session;
  if (sess) {
    res.redirect('/manage/books');
  } else {
    res.render('manage/index', {
      title: 'BookStore',
      layout: 'manage/layout'
    });
  }
});

router.get('/books', ensureAuthenticated, function (req, res, next) {

  Book.find({}, {}, function (err, books) { // category name
    if (err) {
      console.log(err);
    }

    res.render('manage/books/index', {
      "books": books, // model
      title: 'BookStore',
      layout: 'manage/layout'
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/manage/login');
}

router.get('/categories', ensureAuthenticated, function (req, res, next) {
  Category.find({}, {}, function (err, categories) { // category name
    if (err) {
      console.log(err);
    }

    res.render('manage/categories/index', {
      "categories": categories, // model
      title: 'BookStore',
      layout: 'manage/layout'
    });
  });
});

router.get('/books/add', function (req, res, next) {
  Category.find({}, {}, function (err, categories) {
    if (err) {
      console.log(err);
    }

    res.render('manage/books/add', {
      "categories": categories,
      title: 'BookStore',
      layout: 'manage/layout'
    });
  });
});

router.post('/books/add', function (req, res, next) {
  var title = req.body.title && req.body.title.trim();
  var category = req.body.category && req.body.category.trim();
  var author = req.body.author && req.body.author.trim();
  var publisher = req.body.publisher && req.body.publisher.trim();
  var price = req.body.price && req.body.price.trim();
  var description = req.body.description && req.body.description.trim();
  var cover = req.body.cover && req.body.cover && req.body.cover.trim();

  if (title == '' || price == '') {
    req.flash('error_msg', "please fill out required fields");
    res.location('/manage/books/add');
    res.redirect('/manage/books/add');
  }

  if (isNaN(price)) {
    req.flash('error_msg', "Price must be a number");
    res.location('/manage/books/add');
    res.redirect('/manage/books/add');
  }

  var newBook = new Book({
    title: title,
    category: category,
    author: author,
    publisher: publisher,
    price: price,
    description: description,
    cover: cover
  });

  newBook.save(function (err) {
    if (err) {
      console.log('save error', err);
    }

    req.flash('success_msg', "Book Added Successfully!");
    res.location('/manage/books');
    res.redirect('/manage/books');
  });
});

// Display edit form
router.get('/books/edit/:id', function (req, res, next) {
  Category.find({}, {}, function (err, categories) {
    Book.findOne({
      _id: req.params.id
    }, function (err, books) {
      if (err) {
        console.log(err);
      }

      res.render('manage/books/edit', {
        "books": books,
        "categories": categories,
        layout: 'manage/layout'
      });
    });
  });
});

// Edit Book
router.post('/books/edit/:id', function (req, res, next) {
  var title = req.body.title && req.body.title.trim();
  var category = req.body.category && req.body.category.trim();
  var author = req.body.author && req.body.author.trim();
  var publisher = req.body.publisher && req.body.publisher.trim();
  var price = req.body.price && req.body.price.trim();
  var description = req.body.description && req.body.description.trim();
  var cover = req.body.cover && req.body.cover && req.body.cover.trim();

  Book.update({
    _id: req.params.id
  }, {
    title: title,
    category: category,
    author: author,
    publisher: publisher,
    price: price,
    description: description,
    cover: cover
  }, function (err) {
    if (err) {
      console.log('Update Error', err);
    }

    req.flash('success_msg', "Book Updated Successfully!");
    res.location('/manage/books');
    res.redirect('/manage/books');
  });
});

// Delete Book
router.get('/books/delete/:id', function (req, res) {
  Book.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err);
    }

    req.flash('success_msg', "Book Deleted Successfully!");
    res.location('/manage/books');
    res.redirect('/manage/books');
  });
});

// Display category add form
router.get('/categories/add', function (req, res) {
  res.render('manage/categories/add', {
    layout: 'manage/layout'
  });
});

// Add a new Category
router.post('/categories/add', function (req, res, next) {
  var name = req.body.name && req.body.name.trim();


  if (name == '') {
    req.flash('error_msg', "please fill out required field");
    res.location('/manage/categories/add');
    res.redirect('/manage/categories/add');
  } 

    var newCategory = new Category({
      name: name
    });

    newCategory.save(function (err) {
      if (err) {
        console.log('save error', err);
      }

      req.flash('success_msg', "Category Added Successfully!");
      res.location('/manage/categories');
      res.redirect('/manage/categories');
    });
});

// Display Category edit form
router.get('/categories/edit/:id', function (req, res, next) {
  Category.findOne({
    _id: req.params.id
  }, function (err, categories) {
    if (err) {
      console.log(err);
    }

    res.render('manage/categories/edit', {
      "categories": categories,
      layout: 'manage/layout'
    });
  });
});

// Edit Category
router.post('/categories/edit/:id', function (req, res, next) {
  var name = req.body.name && req.body.name.trim();

  Category.update({
    _id: req.params.id
  }, {
    name: name
  }, function (err) {
    if (err) {
      console.log('Update Error', err);
    }

    req.flash('success_msg', "Category Updated Successfully!");
    res.location('/manage/categories');
    res.redirect('/manage/categories');
  });
});

// Delete Category
router.get('/categories/delete/:id', function (req, res) {
  Category.remove({
    _id: req.params.id
  }, function (err) {
    if (err) {
      console.log(err);
    }

    req.flash('success_msg', "Category Deleted Successfully!");
    res.location('/manage/categories');
    res.redirect('/manage/categories');
  });
});

//  ======================== Register Manager  =======================
router.get('/register', function (req, res, next) {
  res.render('manage/register', {
    'title': 'Register',
    layout: 'manage/layout'
  });
});

router.post('/register', function (req, res, next) {
  // get form values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Form Validators
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    //checking for email and username are already taken
    Manager.findOne({
      username: {
        "$regex": "^" + username + "\\b",
        "$options": "i"
      }
    }, function (err, user) {
      Manager.findOne({
        email: {
          "$regex": "^" + email + "\\b",
          "$options": "i"
        }
      }, function (err, mail) {
        if (user || mail) {
          res.render('register', {
            user: user,
            mail: mail
          });
        } else {
          var newUser = new Manager({
            name: name,
            email: email,
            username: username,
            password: password
          });
          Manager.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
          });
          req.flash('success_msg', 'You are registered and can now login');
          res.redirect('/manage/login');
        }
      });
    });
  }
});

// ==========================  Manager Login  ================================
router.get('/login', function (req, res, next) {
  // var sess = req.session.username;
  if (req.session.username) {
    res.redirect('/manage/books');
  } else {
  res.render('manage/index', {
    'title': 'LogIn',
    layout: 'manage/layout'
  });
  }
});

var manager = db.collection('Manager');

passport.use(new LocalStrategy(
  function (username, password, done) {
    Manager.getUserByUsername(username, function (err, manager) {
      if (err) throw err;
      if (!manager) {
        console.log('Unknown User');
        return done(null, false, {
          message: 'Unknown User'
        });
      }

      Manager.comparePassword(password, manager.password, function (err, isMatch) {
        // if(err) throw err;
        if (isMatch) {
          console.log('valid');
          return done(null, manager);

        } else {
          console.log('Invalid Password');
          console.log(manager.username);
          console.log(manager.password);
          console.log(password);
          return done(null, false, {
            message: 'Invalid Password'
          });
        }
      });
    });
  }
));

passport.serializeUser(function (manager, done) {
  done(null, manager.id);
});

passport.deserializeUser(function (id, done) {
  Manager.getUserById(id, function (err, manager) {
    done(err, manager);
  });
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/manage/books',
  failureRedirect: '/manage/login',
  failureFlash: 'Invalid Username or password'
}), function (req, res) {
  console.log('Authentication Successful');
  req.flash('success_msg', 'You are logged in');
  res.redirect('/manage/books/index');
});


// ===============logout===============
router.get('/logout', function (req, res) {
  req.logout();
  // var manager = req.session.destroy();
  req.flash('success_msg', 'You have logged out');
  res.redirect('/manage/login');
});


module.exports = router;