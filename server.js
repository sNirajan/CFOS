const express = require('express');
const nunjucks = require('nunjucks');
const fs = require("fs");
const mongodb = require("mongodb");
const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const port = 3000;

let env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.njk', {
        appName: 'UWCFOS',
        username: 'Mr. Test',
        cafelist: require('./cafe_list.json')
    });
});

//Rendering new Restaurant page
app.get('/new_Restaurant.njk', (req, res) => {
    res.render('new_Restaurant.njk', {
    });
});

// Getting form data for new restaurant and adding it in json file
app.post("/new_Restaurant.njk", (req,res)=>{
    const client = new mongodb.MongoClient(uri);
    async function testCursor(){
        await client.connect();
        const mycol = await client
            .db("cafe's").collection("cafe_lists");
        return mycol.insertOne(req.body);
}
testCursor().then(console.log);

client.close();
    res.send("Form submitted");
});

app.get('/cafe/:id', (req, res) => {
    let cafelist = require('./cafe_list.json');
    let isCafeFound = false;

    for(let cafe of cafelist) {
        if(cafe.id == req.params['id']) {
            isCafeFound = true;

            let menu_item_list = require('./menu_items.json');
            let menu = [];

            for(let item of menu_item_list) {
                if(item.cafeId == cafe.id) {
                    menu.push(item);
                }
            }
            res.render('./cafe.njk', {
                cafeData: cafe,
                menu_items: menu
            });
        }
    }

    if(!isCafeFound) {
        res.status(404).send('404.html');
    }
});

app.listen(port, () => {
    console.log('App listening at http://localhost:' + port);
});