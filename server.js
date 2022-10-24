const express = require('express');
const nunjucks = require('nunjucks');

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
        username: 'Xyz abc'
    });
});

app.listen(port, () => {
    console.log('App listening at http://localhost:' + port);
});


