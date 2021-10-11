const express = require('express');
const app = express();
const services = require('./routes/service.route');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended:true}));

app.set('view engine', 'pug');

app.use(services);

app.listen(3000);


