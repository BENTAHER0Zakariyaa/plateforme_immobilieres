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

const PostSchema = new Schema({
    User: { type: Schema.Types.ObjectId, ref: 'User' },
    title: {type:String,required:true},
    cover: {type:String,required:true},
    images: [{type:String}],
    description: {type:String,required:true},
    surface: {type:Number,required:true},
    price: {type:Number,required:true},
    city: {type:String,required:true},
    type: {type:String,required:true},
    characteristics: [{type:String}]
},{timestamps: true});

const User = mongoose.model('User',userSchema);
const Post = mongoose.model('Post',PostSchema);

module.exports = {Post, User};