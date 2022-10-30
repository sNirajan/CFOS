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
const client = new mongodb.MongoClient(uri);

app.get('/', (req, res) => {
    getCafeLists().then(cafe_list => {
        console.log(cafe_list);
        // Rendering index page and providing it with some data
        res.render('index.njk', {
            appName: 'UWCFOS',
            username: 'Mr. Test',
            cafelist: cafe_list
        });
    });
});

//Rendering new Restaurant page
app.get('/new_Restaurant.njk', (req, res) => {
        res.render('new_Restaurant.njk', {
    });
});

app.get('/cafe/:id', (req, res) => {
    let isCafeFound = false;
    getCafe(req.params['id']).then(cafe => {
        if(cafe == null) {
            res.status(404).send('404.html');
        } 
        else {
            getMenuList(req.params['id']).then(menu_list=>{
                res.render('./cafe.njk', {
                    cafeData: cafe,
                    menu_items: menu_list
                });
            }); 
        }  
    });
});

app.route('/cafe/:id/addMenuItem')
    .get((req, res) => {
        getCafe(req.params['id']).then(cafe => {
            console.log(cafe);
            res.render('addMenuItem.njk', {
                cafeData: cafe
            });
        });
    })
    .post((req,res)=>{
        const client = new mongodb.MongoClient(uri);
        async function testCursor(){
            await client.connect();
            const mycol = await client
                .db("cafe's").collection("menu_items");
            req.body.cafe_id = req.params['id'];
            return mycol.insertOne(req.body);
    }
    testCursor().then(console.log);
    
    client.close();
        res.send("Form submitted");
    });

// Getting form data for new restaurant and adding it in json file
app.post("/new_Restaurant.njk", (req,res )=>{
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

// Function to get cafe Lists
async function getCafeLists(){
    await client.connect();
    const mycol = await client
        .db("cafe's").collection("cafe_lists");
        const cursor = mycol.find({});
        return await cursor.toArray();
};

// Function to get cafe Lists
async function getCafe(cafeId){
    await client.connect();
    const mycol = await client
        .db("cafe's").collection("cafe_lists");
        const cursor = mycol.findOne({ '_id': mongodb.ObjectId(cafeId)});
        return await cursor;
};

// Function to get munu items
async function getMenuList(cafeId){
    await client.connect();
    const mycol = await client
        .db("cafe's").collection("menu_items");
        const cursor = mycol.find({cafe_id: cafeId});
        return await cursor.toArray();
};



app.listen(port, () => {
    console.log('App listening at http://localhost:' + port);
});