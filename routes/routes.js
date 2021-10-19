const express = require('express');
const Router = express.Router();
const multer  = require('multer');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const {Post, User } = require('./../models/Post')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../public/uploads`);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        cb(null,uniqueSuffix + '_' + file.originalname )
    }
})

const upload = multer({ storage: storage })

// const articles = [
//     {
//         id:1,
//         cover: 'house-2.jpg' ,
//         title:'Al Kawtar Residence',
//         city:'El Mansouria',
//         createdAt:'12/02/2020',
//         price:"620,000",
//         description:'Along the ocean on the coastal road Mohammedia-Bouznika, the seaside village AL KAWTAR offers on more than 10 hectares, a picturesque setting to magnificent villas and apartments. ',
//         surface:72,
//         images:
//             [
//                 'house-1.jpg',
//                 'house-2.jpg',
//                 'house-3.png'
//             ],
//         composites:
//             [
//                 '4 chambres',
//                 'Climatisation',
//                 'Vue mer',
//                 'Villa neuve',
//                 'DPE Vierge',
//                 'VBE210046','4 chambres',
//                 'Climatisation',
//                 'Vue mer',
//                 'Villa neuve',
//                 'DPE Vierge',
//                 'VBE210046',
//             ],
//         type:'villa',
//         client :
//             {
//                 id:1,
//                 phone:'0658884719',
//                 email:'aaaaaa@gmail.com'
//             }
//     },
//     {id:2,title:'Sunshade Systems', city:'Khemisset', createdAt:'15/10/2020', price:19000.00, surface:10, image:'house-2.jpg'},
//     {id:3,title:'Modular House on the Slope / BIO-architects', city:'Fes', createdAt:'21/07/2017', price:1000000.00, surface:600, image:'house-3.png'},
//     {id:4,title:'Thermowood Battens', city:'Fes', createdAt:'21/07/2017', price:1000000.00, surface:600, image:'house-3.png'},
// ]


// GENERALE ROUTES
Router.get('/', async(req, res)=>{
    const articles = await Post.find({}, {}, { sort: { 'created_at' : -1 }}).limit(3);
    res.render('index', {title: 'Accueil', articles: articles,session:req.session});
});
Router.get('/explorer', async(req, res)=>{

    let where = {};
    let params = '';
    const city = req.query.city;
    const type = req.query.type;
    if (city) {
        params+=`\&city=${city}`
        where.city = city;
    }
    if (type) {
        params += `\&type=${type}`
        where.type = type;
        }
    const countArticles = await Post.count(where);
    if (countArticles!= 0)
    {

        const pagesCount = Math.ceil((countArticles/9));

        if(!req.query.page)req.query.page = 1;

        if(req.query.page > pagesCount || req.query.page < 1 )
        {
            const currentPage = req.query.page < 1 ? 1 : pagesCount;
            return res.redirect(`/explorer?page=${currentPage}`);
        }
        else{
            const currentPage = req.query.page;
            const previous = currentPage > 1 ? currentPage-1 : 0 ;
            const next = currentPage >= pagesCount ? pagesCount :  parseInt(currentPage) + 1 ;
            const articles   = await Post.find(where).skip((currentPage-1)*9).limit(9);
            console.log(articles)
            res.render('explorer', {title : 'Explorer',params: params, currentPage:currentPage,previous:previous,next:next,articles:articles,session:req.session});
        }
    }
    else
        res.render('explorer', {title : 'Explorer',currentPage:1,previous:0,next:1,articles:null, session:req.session});


});
Router.get('/explorer/details/:id', async(req, res)=>{
    let page_data = {}

    const article = await Post.findById(req.params.id).populate('User');
    console.log(article);

    if(!article)
    {
        page_data.title ='Not Found'
        return res.status(404).json('Not Found');
    }

    page_data.title = article.title;
    page_data.article = article;
    page_data.session = req.session;


    return res.render('details', page_data);
   
});
Router.get('/dashboard', async (req, res)=>{
    if(req.session.user_id==undefined)
        return res.redirect('/login');
    const id = req.session.user_id;
    const articles = await Post.find({User:id});

    return res.render('dashboard', {title:'Dashboard',articles:articles, session:req.session});
});

Router.get('/post', async (req, res)=>{
    if(req.session.user_id==undefined)
        return res.redirect('/login');
    return res.render('create_post', {title:'Créer un poste',session:req.session});
});
Router.get('/post/:id/delete', async (req, res)=>{
    if(req.session.user_id==undefined)
        return res.redirect('/login');
    const post = await Post.findByIdAndDelete(req.params.id);
    fs.unlinkSync(`./public/uploads/${post.cover}`)
    post.images.map(i=>{
        fs.unlinkSync(`./public/uploads/${i}`);
    })
    return res.redirect('/dashboard');
});
Router.post('/post',upload.fields([{name: 'cover', maxCount: 1}, {name: 'images'}]), async (req, res)=>{

    const {title, description, surface, price, city, type, characteristics} = req.body;
    const images = req.files.images.map((item)=>item.filename);
    const cover = req.files.cover[0].filename;
    const User = req.session.user_id;
    if (!title || !cover || !images || !description || !surface || !price || !city || !type || !characteristics) {
        const path = `${__dirname}/../public/uploads/`;
        fs.unlinkSync(path+cover);
        images.forEach(m=>{
            fs.unlinkSync(path+m);
        })
        return res.render('create_post', {title: 'Créer un poste', error:'Tous les champs sont requis'});
    }
    await Post.create({User,title,cover,images, description, surface, price, city, type, characteristics});
    res.redirect('dashboard');
});
//AUTH ROUTES
Router.get('/register', async(req, res)=>{
    if(!req.session.user_id==undefined)
        return res.redirect('/');
    return res.render('register', {title:'Inscription'});
});
Router.post('/register', async(req, res)=>{
    let {firstname, lastname, number, email, password} = req.body;
    if (!firstname || !lastname || !number || !email || !password )
    {
        return res.render('register', {title:'Inscription', error:'Tous les champs sont requis'});
    }
    const user = await User.find({number:number, email:email});
    if(user.length > 0)
    {
        return res.render('register', {title:'Inscription', error:'Email & numéro existes déjà'});
    }
    var salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
    await User.create({firstname, lastname, number, email, password});
    return res.redirect('/');
});
Router.get('/login', async(req, res)=>{

    if(req.session.user_id!=undefined)
        console.log(req.session.user_id)
    return res.render('login', {title:'Connexion'});
});
Router.post('/login', async(req, res)=>{
    let {email, password} = req.body;
    if (!email || !password)
    {
        return res.render('login', {title:'Connexion', error:'Tous les champs sont requis'});;
    }
    const user = await User.find({email:email});
    if(user.length == 0)
    {
        return res.render('login', {title:'Connexion', error:'Compte n\'existe pas'});
    }
    if(!bcrypt.compareSync(password,user[0].password))
    {
        return res.render('login', {title:'Connexion', error:'Compte n\'existe pas'});
    }
    req.session.user_id = await user[0]._id;
    req.session.user_role = await user[0].role;
    return res.redirect('/');
});
Router.get('/logout', async(req, res)=>{
    req.session.destroy(()=>{
        return res.redirect('/');
    });
});



module.exports = Router;