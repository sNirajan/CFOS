const express = require('express');
const nunjucks = require('nunjucks');
const mongodb = require('mongodb');
const multiparty = require('multiparty');
const fs = require('fs');

const app = express();
const port = 3000;

const uri = 'mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority';
const client = new mongodb.MongoClient(uri);

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// ROUTE HANDLER FUNCTIONS                                                           //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////

/**
 * GET route for the admin index page.
 * TODO: restrict to authenticated users only.
 */
app.get('/', (req, res) => {
    getCafeList().then(cafeList => {
        res.status(200).render('index.njk', {
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
            res.status(404).sendFile('./public/404.html');
        } 
        else {
            getCafeMenu(req.params['id']).then(menu => {
                res.status(200).render('./cafe.njk', {
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
        res.status(200).render('./createCafe.njk')
    })
    .post((req, res) => {
        async function insertCafe() {
            await client.connect();
            const cafeListCol = await client.db("cafe's").collection('cafe_lists');
            return cafeListCol.insertOne(req.body);
        }
        insertCafe();
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
            if(cafe == null) {
                res.status(404).sendFile('./public/404.html');
            }
            else {
                res.status(200).render('./editCafe.njk', {
                    cafe: cafe
                });
            }
        });
    })
    .post((req, res) => {
        async function updateCafe() {
            await client.connect();
            const cafeListCol = await client.db("cafe's").collection('cafe_lists');
            
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
        updateCafe();
        res.redirect('/cafe/' + req.params['id']);
    });

/**
 * GET Route to delete a particular cafe by id.
 * TODO: Restrict to only authenticated admin level users.
 */
app.get('/cafe/:id/delete', (req, res) => {
    async function deleteCafe() {
        await client.connect();
        const cafeListCol = await client.db("cafe's").collection('cafe_lists');
        return cafeListCol.deleteOne({_id: mongodb.ObjectId(req.params['id'])});
    }
    deleteCafe();
    res.send('SUCCESS');
});

/**
 * GET route for showing the form to create new menu item for a particular cafe. 
 * TODO: Restrict to authenticated admin level users only. 
 */
app.route('/cafe/:id/createMenuItem')
    .get((req, res) => {
        getCafe(req.params['id']).then(cafe => {
            if(cafe == null) {
                res.status(404).sendFile('./public/404.html');
            }
            else  { 
                res.status(200).render('createMenuItem.njk', {
                    cafe: cafe
                });
            }
        });
    })
    .post((req, res) => {
        async function insertMenuItem() {
            await client.connect();
            const menuItemCol = await client.db("cafe's").collection('menu_items');
            req.body.cafe_id = req.params['id'];
            return menuItemCol.insertOne(req.body);
        }
        insertMenuItem();
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
            if(menuItem == null) {
                res.status(404).sendFile('./public/404.html');
            }
            else { 
                res.status(200).render('./editMenuItem.njk', {
                    menuItem: menuItem
                });
            }
        });
    })
    .post((req, res) => {
        async function updateMenuItem() {
            await client.connect();
            const menuItemCol = await client.db("cafe's").collection('menu_items');
            
            let query = { _id: mongodb.ObjectId(req.params['id']) };
            let update = { $set: { 
                name: req.body.name, 
                price: req.body.price,
                description: req.body.description,
                isAvailable: req.body.isAvailable
            }};
            return menuItemCol.findOneAndUpdate(query, update, {});
        }
        updateMenuItem();

        getMenuItem(req.params['id']).then(menuItem => {
            if(menuItem == null) {
                res.status(404).sendFile('./public/404.html');
            }
            else {
                res.redirect('/cafe/' + menuItem.cafe_id);
            }
        });
    });

 /**
 * GET Route to delete a particular menu item by id.
 * TODO: Restrict to only authenticated admin level users.
 */

app.get('/menu/:id/delete', (req, res) => {
    async function deleteMenuItem() {
        await client.connect();
        const menuItemCol = await client.db("cafe's").collection('menu_items');
        return menuItemCol.deleteOne({_id: mongodb.ObjectId(req.params['id'])});
    }
    deleteMenuItem();
    res.send('SUCCESS');
});


/**
 * GET route to show the form for creating new employee.
 * TODO: Restrict this function only to authenticated admin level user. 
 */
app.route('/createEmployee')
    .get((req, res) => {
        getCafeList().then(cafeList => {
            res.status(200).render('./createEmployee.njk', {
                cafeList: cafeList,
            });
        });
    })
    .post((req, res) => {
        async function insertEmployee() {
            await client.connect();
            const employeeCol = await client.db("cafe's").collection('users');
            return employeeCol.insertOne(req.body);
        }
        insertEmployee();
        res.redirect('/employeeList');
    });

/**
 * GET route to show the list of employees.
 * TODO: Restrict to only authenticated admin level users. 
 */
app.get('/employeeList', (req, res) => {
    getEmployeeList().then(employeeList => { 
        res.status(200).render('./employeeList.njk', {
            employeeList: employeeList,
        });
    });
});

/**
 * GET route to show the form for editing a Employee.
 * POST route to update the Employee in DB.
 * TODO: Restrict to authenticated admin level users only. 
 */
app.route('/employee/:id/edit')
    .get((req, res) => {
        getEmployee(req.params['id']).then(employee => {
            if(employee == null) {
                res.status(404).sendFile('./public/404.html');
            }
            else {
                getCafeList().then(cafeList => {
                    res.status(200).render('./editEmployee.njk', {
                        employee: employee,
                        cafeList: cafeList
                    });
                });
            }       
        });
    })
    .post((req, res) => {
        async function updateEmployee() {
            await client.connect();
            const employeeCol = await client.db("cafe's").collection('users');
            
            let query = { _id: mongodb.ObjectId(req.params['id']) };
            let update = { $set: { 
                firstName: req.body.firstName, 
                lastName: req.body.lastName,
                position: req.body.position,
                wage: req.body.wage,
                cafe_id: req.body.cafe_id,
                user_level: req.body.user_level,
                note: req.body.note
            }};
            return employeeCol.findOneAndUpdate(query, update, {});
        }
        updateEmployee();
        res.redirect('/employeeList');
    });

/**
 * GET Route to delete a particular employee by id.
 * TODO: Restrict to only authenticated admin level users.
 */
app.get('/employee/:id/delete', (req, res) => {
    async function deleteEmployee() {
        await client.connect();
        const employeeCol = await client.db("cafe's").collection('users');
        return employeeCol.deleteOne({_id: mongodb.ObjectId(req.params['id'])});
    }
    deleteEmployee();
    res.redirect('/employeeList');
});

/**
 * GET route to show the Instafood page.
 */
app.get('/instafood', (req, res) => {
    let foodImgList = [];
    fs.readdirSync('./public/instafood/').forEach(file => {
        foodImgList.push(file);
    });
    res.status(200).render('instafood.njk', {
        foodImgList: foodImgList
    });
});

/**
 * POST route to save uploaded image to the local disk. 
 * TODO: Resctrict to authenticated users only. 
 */
app.post('/instafood/uploadImage', (req, res) => {
    let form = new multiparty.Form({ uploadDir: './public/instafood' });
    form.parse(req, (err, fields, files) => {
        res.redirect('/instafood');
    });
});
//------------------------------------------------------------------------------------
//DO NOT WRITE ANY ROUTE HANDLER METHOD UNDER THIS LINE
//------------------------------------------------------------------------------------


///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// UTILITY FUNCTIONS                                                                 //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Function to retrieve the entire collection of cafeterias from DB. 
 * @returns { [Object] } the list of cafeterias. 
 */
async function getCafeList(){
    await client.connect();
    const cafeListCol = await client.db("cafe's").collection('cafe_lists');
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
    const cafeListCol = await client.db("cafe's").collection('cafe_lists');
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
    const menuItemCol = await client.db("cafe's").collection('menu_items');
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
    const menuItemCol = await client.db("cafe's").collection('menu_items');
    const cursor = menuItemCol.findOne({ _id: mongodb.ObjectId(menuId) });
    return await cursor;
}

/**
 * Function to retrieve Employees List from a DB.
 * @returns { Object } List of the Employees
 */
 async function getEmployeeList(){
    await client.connect();
    const employeeCol = await client.db("cafe's").collection('users');
    const cursor = employeeCol.find({});
    return await cursor.toArray();
}

/**
 * Function to retrieve a single Employee from a DB.
 * @param { string } empId Id of the Employee to retrieve.
 * @returns { Object } The Employee object.
 */
 async function getEmployee(empId){
    await client.connect();
    const employeeCol = await client.db("cafe's").collection('users');
    const cursor = employeeCol.findOne({ _id: mongodb.ObjectId(empId) });
    return await cursor;
}
//-----------------------------------------------------------------------------
//UTILITY METHODS END HERE
//-----------------------------------------------------------------------------

/**
 * 404 page not found error handler middleware.
 */
 app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html')
});

/**
 * 500 internal server error handler middleware.
 */
app.use( (err, req, res, next) => {
    res.status(500).sendFile(__dirname + '/public/500.html')
});

app.listen(port, () => {
    console.log('App listening on http://localhost:' + port);
});