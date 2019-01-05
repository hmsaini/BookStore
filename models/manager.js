const mongoose = require('mongoose');
var bcrypt=require('bcryptjs');

var db=mongoose.connection;

// CategoryModel Schema
var managerSchema=mongoose.Schema({
username:{
	type:String
},
password:{
    type:String
}
});

var Manager = module.exports = mongoose.model('Manager', managerSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	Manager.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	Manager.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}