const mongoose = require('mongoose');
var bcrypt=require('bcryptjs');



// CategoryModel Schema
var categorySchema=mongoose.Schema({
name:{
	type:String
}
});

var Category = module.exports = mongoose.model('Category', categorySchema);

