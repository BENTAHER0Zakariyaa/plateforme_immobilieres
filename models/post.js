const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
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

const Post = mongoose.model('Post',PostSchema);

module.exports = Post;