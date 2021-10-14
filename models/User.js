const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    firstname: {type:String,required:true},
    lastname: {type:String,required:true},
    number: {type:String,required:true,unique:true},
    role: {type:String,default:'USER_ROLE'}
},{timestamps: true});

const User = mongoose.model('User',userSchema);

module.exports = User;