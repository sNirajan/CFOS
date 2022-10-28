const express = require('express');
const nunjucks = require('nunjucks');
const fs = require("fs");
const mongodb = require("mongodb");
const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const port = 3000;

const client = new mongodb.MongoClient(uri);

async function testCursor(){
    await client.connect();
    const mycol = await client
        .db("cafe's").collection("cafe_lists");
        const cursor = mycol.find({});
        await cursor.forEach(doc=>{console.log(doc.Cafe)});
        //return cursor.toArray();
        return "Done";
}
testCursor().then(console.log);

client.close();

app.listen(port, () => {
    console.log('App listening at http://localhost:' + port);
});