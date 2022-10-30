const express = require('express');
const nunjucks = require('nunjucks');
const fs = require("fs");
const mongodb = require("mongodb");
const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const port = 3000;

const client = new mongodb.MongoClient(uri);

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    getCafeList().then(cafeList => {
        res.render('index.njk', {
            appName: 'UWCFOS',
            username: 'Mr. Test',
            userLevel: 0, //This value should be dynamically assigned when authentication is implemented (0 = admin, 1 = staff, 2 = customer)
            cafeList: cafeList
        });
    });
});

app.get('/cafe/:id', (req, res) => {
    const cafeId = req.params['id'];

    getCafe(cafeId).then(cafe => {
        if(cafe == null) {
            res.status(404).send('404.html');
        } 
        else {
            getCafeMenu(cafeId).then(menu => {
                res.render('./cafe.njk', {
                    cafe: cafe,
                    menu: menu
                });
            }); 
        }  
    });
});

app.route('/createCafe')
    .get((req, res) => {
        res.render('./createCafe.njk')
    })
    .post((req, res) => {
        const client = new mongodb.MongoClient(uri);
        async function insertCafe() {
            await client.connect();
            const cafeListCol = await client
                .db("cafe's").collection("cafe_lists");
            return cafeListCol.insertOne(req.body);
        }
        insertCafe().then(console.log);

        client.close();
        res.redirect('/');
    });

app.route('/cafe/:id/createMenuItem')
    .get((req, res) => {
        getCafe(req.params['id']).then(cafe => {
            console.log(cafe);
            res.render('createMenuItem.njk', {
                cafe: cafe
            });
        });
    })
    .post((req, res) => {
        const client = new mongodb.MongoClient(uri);
        async function insertMenuItem() {
            await client.connect();
            const menuItemCol = await client
                .db("cafe's").collection("menu_items");
            req.body.cafe_id = req.params['id'];
            return menuItemCol.insertOne(req.body);
        }
        insertMenuItem().then(console.log);
        
        client.close();
        res.redirect(`/cafe/${req.params['id']}`);
    });


// Function to get cafe Lists
async function getCafeList(){
    await client.connect();
    const cafeListCol = await client
        .db("cafe's").collection("cafe_lists");
    const cursor = cafeListCol.find({});
    return await cursor.toArray();
}

// Function to get a cafe info by cafe id
async function getCafe(cafeId){
    await client.connect();
    const cafeListCol = await client
        .db("cafe's").collection("cafe_lists");
        const cursor = cafeListCol.findOne({ '_id': mongodb.ObjectId(cafeId)});
        return await cursor;
}

// Function to get munu of a cafe
async function getCafeMenu(cafeId){
    await client.connect();
    const menuItemCol = await client
        .db("cafe's").collection("menu_items");
    const cursor = menuItemCol.find({ cafe_id: cafeId });
    return await cursor.toArray();
}

app.listen(port, () => {
    console.log('App listening at http://localhost:' + port);
});