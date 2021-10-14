const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const routes = require('./routes/routes');

// session setip
app.use(session({
    secret: 'ipzChzPW0roD8O8a',
    resave: false,
    saveUninitialized: false,
    // 3days
    cookie: { maxAge: 1000*60*60*24*3 }
}));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('view engine', 'pug');

app.use(routes);

app.listen(3000);
mongoose.connect('mongodb+srv://db_immobiliers:ipzChzPW0roD8O8a@cluster0.naetp.mongodb.net/db_immobiliers?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });


