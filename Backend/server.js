const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { connect } = require('./database/database');
const ngrok = require('ngrok');
const { client } = require('./database/database');

/*
TO RUN SERVER DO NPM START AND ON ANOTHER TERMINAL DO NPX NGROK HTTP 8080
*/

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello World')
})

app.post('/', async (req, res) => {
    console.log("Webhook received:");
    console.log(req.body);
    //THIS INFORMATION WE NEED TO SEND IT TO THE DATABASE, SO WE CAN STORE 
    //WHICH ACTIVITIES ARE RELATED TO THE TAGS THAT THE HOST CREATES 

    //Ensure the client is connected
    //if (!client.isConnected()) await client.connect();

    //Specify the database and collection
    const db = client.db('integrativeProjectDB');
    const collection = db.collection('Activities');

    //Insert the data into the database
    await collection.insertOne(req.body);

    res.status(200).send(req.body);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect()
    console.log("Server listening on port " + port);  
})