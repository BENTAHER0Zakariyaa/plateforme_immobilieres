const express = require('express');
const Router = express.Router();
/* 
TODO : create route home 
TODO : create route about
TODO : create route contact
*/

const articles = [
    {id:1,title:'Al Kawtar Residence', city:'El Mansouria', createdAt:'12/02/2020', price:"620,000", description:'Along the ocean on the coastal road Mohammedia-Bouznika, the seaside village AL KAWTAR offers on more than 10 hectares, a picturesque setting to magnificent villas and apartments. Built with the greatest respect for the art and traditions of Arab-Andalusia, where the know-how combines wonderfully with modern comfort and the refinement of traditional Moroccan craftsmanship.THE SERVICES OF THE SEASIDE VILLAGE AL KAWTAR In the residence, closed and guarded, you will find a shopping center, an aquapark, several swimming pools including a covered one for women, playgrounds for your children as well as tennis courts and football and basketball fields, a fitness room, a nursery, a restaurant and areas for jogging and hiking. For parking, no worries: a car park in front of your home, numbered basement car parks and a large guarded car park in front of the residence will allow your guests to enjoy this unique and majestic place in complete peace of mind.', surface:72, image:'house-1.jpg'},
    {id:2,title:'Sunshade Systems', city:'Khemisset', createdAt:'15/10/2020', price:19000.00, surface:10, image:'house-2.jpg'},
    {id:3,title:'Modular House on the Slope / BIO-architects', city:'Fes', createdAt:'21/07/2017', price:1000000.00, surface:600, image:'house-3.png'},
    {id:4,title:'Thermowood Battens', city:'Fes', createdAt:'21/07/2017', price:1000000.00, surface:600, image:'house-3.png'},
]

Router.get('/', async(req, res)=>{

    const page_data = {
        title : 'Home',
        articles : articles.slice(0,3)
    }

    res.render('index', page_data);
});
Router.get('/explorer', async(req, res)=>{
    const page_data = {
        title : 'Explorer'
    }
    const pagesCount = Math.ceil((articles.length/9));

    if(!req.query.page)req.query.page = 1;

    if(req.query.page > pagesCount || req.query.page < 1 )
    {
        page_data['currentPage']=req.query.page < 1 ? 1 : pagesCount;
        return res.redirect(`/explorer?page=${page_data.currentPage}`);
    }
    else{
        page_data['currentPage']=req.query.page;
        page_data['previous']=page_data.currentPage > 1 ? page_data.currentPage-1 : 0 ;
        page_data['next']=page_data.currentPage >= pagesCount ? pagesCount :  parseInt(page_data.currentPage) + 1 ;
        page_data["articles"] = articles.slice((page_data.currentPage-1)*9, page_data.currentPage *9);
        res.render('explorer', page_data);
    }
});

Router.get('/explorer/details/:id', async(req, res)=>{
    let page_data = {}

    const art = articles.filter((a)=>a.id==req.params.id);

    if(art.length == 0)
    {
        page_data.title ='Not Found'
        return res.status(404).json('Not Found');
    }
    
    page_data.title = art[0].city;
    page_data.articale = art[0];

    return res.render('details', page_data);
   
});

Router.get('/about', async(req, res)=>{

});
Router.get('/contact', async(req, res)=>{

});



module.exports = Router;