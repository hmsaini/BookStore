const mongoose = require('mongoose');
var bcrypt=require('bcryptjs');

mongoose.connect('mongodb://localhost/BookStore', { useNewUrlParser: true }) // BookStore->database
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connected to MongoDB...', err));
var db=mongoose.connection;

// BookModel Schema
var bookSchema=mongoose.Schema({
title:{
	type:String
},
category:{
	type:String
},
description:{
	type:String
},
author:{
	type:String
},
publisher:{
    type:String
},
price:{
type:Number
},
cover:{
type:String
}
});

// Shorten text
bookSchema.methods.truncText=function(length){
	return this.description.substring(0,length);
};

var Book = module.exports = mongoose.model('Book', bookSchema);

// module.exports.createUser = function(newUser, callback){
// 	bcrypt.genSalt(10, function(err, salt) {
// 	    bcrypt.hash(newUser.password, salt, function(err, hash) {
// 	        newUser.password = hash;
// 	        newUser.save(callback);
// 	    });
// 	});
// }

// module.exports.getUserByUsername = function(username, callback){
// 	var query = {username: username};
// 	User.findOne(query, callback);
// }

// module.exports.getUserById = function(id, callback){
// 	User.findById(id, callback);
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback){
// 	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//     	if(err) throw err;
//     	callback(null, isMatch);
// 	});
// }