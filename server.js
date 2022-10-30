const express = require('express');
const nunjucks = require('nunjucks');
const fs = require('fs');
const mongodb = require('mongodb');
const serveIndex = require('serve-index');
const { mongo } = require('mongoose');

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
            res.status(404).send('404.html');
        } 
        else {
            getCafeMenu(req.params['id']).then(menu => {
                console.log(menu);
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
        async function insertCafe() {
            await client.connect();
            const cafeListCol = await client.db("cafe's").collection("cafe_lists");
            return cafeListCol.insertOne(req.body);
        }
        insertCafe().then(console.log);
        res.redirect('/');
    });

/**
 * GET route to show the form for editing a cafeteria.
 * POST route to update the cafeteria info in DB.
 * TODO: Restrict to authenticated admin level users only. 
 */
app.route('/cafe/:id/edit')
    .get((req, res) => {
        getCafe(req.params['id']).then(cafe => {
            res.render('./editCafe.njk', {
                cafe: cafe
            });
        });
    })
    .post((req, res) => {
        async function updateCafe() {
            await client.connect();
            const cafeListCol = await client.db("cafe's").collection("cafe_lists");
            
            let query = { _id: mongodb.ObjectId(req.params['id']) };
            let update = { $set: { 
                name: req.body.name, 
                location: req.body.location,
                phone: req.body.phone,
                daysOpened: req.body.daysOpened,
                startTime: req.body.startTime,
                closeTime: req.body.closeTime,
                description: req.body.description 
            }};
            return cafeListCol.findOneAndUpdate(query, update, {});
        }
        updateCafe().then(console.log);
        res.redirect('/cafe/' + req.params['id']);
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
        async function insertMenuItem() {
            await client.connect();
            const menuItemCol = await client.db("cafe's").collection("menu_items");
            req.body.cafe_id = req.params['id'];
            return menuItemCol.insertOne(req.body);
        }
        insertMenuItem().then(console.log);
        res.redirect(`/cafe/${req.params['id']}`);
    });

/**
 * GET route to show the form for editing a menu item.
 * POST route to update the menu item in DB.
 * TODO: Restrict to authenticated admin level users only. 
 */
app.route('/menu/:id/edit')
    .get((req, res) => {
        getMenuItem(req.params['id']).then(menuItem => {
            res.render('./editMenuItem.njk', {
                menuItem: menuItem
            });
        });
    })
    .post((req, res) => {
        async function updateMenuItem() {
            await client.connect();
            const menuItemCol = await client.db("cafe's").collection("menu_items");
            
            let query = { _id: mongodb.ObjectId(req.params['id']) };
            let update = { $set: { 
                name: req.body.name, 
                price: req.body.price,
                description: req.body.description 
            }};
            return menuItemCol.findOneAndUpdate(query, update, {});
        }
        updateMenuItem().then(console.log);

        getMenuItem(req.params['id']).then(menuItem => {
            res.redirect('/cafe/' + menuItem.cafe_id);
        });
    });


/**
 * Function to retrieve the entire collection of cafeterias from DB. 
 * @returns { [Object] } the list of cafeterias. 
 */
async function getCafeList(){
    await client.connect();
    const cafeListCol = await client.db("cafe's").collection("cafe_lists");
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
    const cafeListCol = await client.db("cafe's").collection("cafe_lists");
    const cursor = cafeListCol.findOne({ '_id': mongodb.ObjectId(cafeId)});
    return await cursor;
}

/**
 * Function to retrieve the food menu of a particular cafeteria.
 * @param { string } cafeId Id of the cafe to retrieve its menu.
 * @returns { [Object] } The list of menu items for the given cafe.
 */
async function getCafeMenu(cafeId){
    await client.connect();
    const menuItemCol = await client.db("cafe's").collection("menu_items");
    const cursor = menuItemCol.find({ cafe_id: cafeId });
    return await cursor.toArray();
}

/**
 * Function to retrieve a single item from a cafe menu.
 * @param { string } menuId Id of the menu item to retrieve.
 * @returns { Object } The menu item object.
 */
 async function getMenuItem(menuId){
    await client.connect();
    const menuItemCol = await client.db("cafe's").collection("menu_items");
    const cursor = menuItemCol.findOne({ _id: mongodb.ObjectId(menuId) });
    return await cursor;
}

app.listen(port, () => {
    console.log('App listening on http://localhost:' + port);
});