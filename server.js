const express = require('express');
const nunjucks = require('nunjucks');
const fs = require('fs');
const mongodb = require('mongodb');
const serveIndex = require('serve-index');

const app = express();
const port = 3000;

const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri);

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.use(express.urlencoded({ extended: true }));
app.use('/usefulResources', express.static(__dirname + '/public/usefulResources'));
app.use('/usefulResources', serveIndex(__dirname + '/public/usefulResources', { icons: true }));

/**
 * GET route for the admin index page.
 * TODO: restrict to authenticated users only.
 */
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

/**
 * GET route for showing a particular cafe
 * TODO: Restrict to authenticated users only. 
 */
app.get('/cafe/:id', (req, res) => {
    getCafe(req.params['id']).then(cafe => {
        if(cafe == null) {
            // if no cafe was found because the cafe id is invalid
            res.status(404).send('404.html');
        } 
        else {
            getCafeMenu(req.params['id']).then(menu => {
                res.render('./cafe.njk', {
                    userLevel: 0, //This value should be dynamically assigned when authentication is implemented (0 = admin, 1 = staff, 2 = customer)
                    cafe: cafe,
                    menu: menu
                });
            }); 
        }  
    });
});

/**
 * GET route to show the form for creating new cafeteria.
 * POST route to store insert new cafeteria into DB.
 * TODO: Restrict to authenticated admin level users only. 
 */
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

/**
 * GET route for showing the form to create new menu item for a particular cafe. 
 * TODO: Restrict to authenticated admin level users only. 
 */
app.route('/cafe/:id/createMenuItem')
    .get((req, res) => {
        getCafe(req.params['id']).then(cafe => {
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


/**
 * Function to retrieve the entire collection of cafeterias from DB. 
 * @returns [Object object] the list of cafeterias. 
 */
async function getCafeList(){
    await client.connect();
    const cafeListCol = await client
        .db("cafe's").collection("cafe_lists");
    const cursor = cafeListCol.find({});
    return await cursor.toArray();
}

/**
 * Function to retrieve a single cafeteria data by id.
 * @param { string } cafeId The id of the cafe to be retrieved.
 * @returns { Object } an object containing the cafe data. 
 */
async function getCafe(cafeId){
    await client.connect();
    const cafeListCol = await client
        .db("cafe's").collection("cafe_lists");
        const cursor = cafeListCol.findOne({ '_id': mongodb.ObjectId(cafeId)});
        return await cursor;
}

/**
 * Function to retrieve the food menu of a particular cafeteria.
 * @param { string } cafeId Id of the cafe to retrieve its menu.
 * @returns [Object object] The list of menu items for the given cafe.
 */
async function getCafeMenu(cafeId){
    await client.connect();
    const menuItemCol = await client
        .db("cafe's").collection("menu_items");
    const cursor = menuItemCol.find({ cafe_id: cafeId });
    return await cursor.toArray();
}

app.listen(port, () => {
    console.log('App listening on http://localhost:' + port);
});