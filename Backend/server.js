const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { connect } = require('./database/database');
const ngrok = require('ngrok');

/*
TO RUN SERVER DO NPM START AND ON ANOTHER TERMINAL DO NPX NGROK HTTP 8080
*/

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello World')
})

app.post('/', (req, res) => {
    console.log("Webhook received:");
    //THIS INFORMATION WE NEED TO SEND IT TO THE DATABASE, SO WE CAN STORE 
    //WHICH ACTIVITIES ARE RELATED TO THE TAGS THAT THE HOST CREATES 
    console.log(req.body);
    res.status(200).send(req.body);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    //connect()
    console.log("Server listening on port " + port);

    
})