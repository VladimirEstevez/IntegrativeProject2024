const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const {
    connect
} = require("./database/database");
const ngrok = require("ngrok");
const {
    client
} = require("./database/database");

/*
TO RUN SERVER DO NPM START AND ON ANOTHER TERMINAL DO NPX NGROK HTTP 8080
*/

app.use(cors());
app.use(morgan("common"));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.post("/", async (req, res) => {
    console.log("Webhook received:");
    console.log(req.body);
    //THIS INFORMATION WE NEED TO SEND IT TO THE DATABASE, SO WE CAN STORE
    //WHICH ACTIVITIES ARE RELATED TO THE TAGS THAT THE HOST CREATES

    //Ensure the client is connected
    //if (!client.isConnected()) await client.connect();

    //Specify the database and collection
    const db = client.db("integrativeProjectDB");
    const collection = db.collection("Activities");

    //Insert the data into the database
    await collection.insertOne(req.body);

    res.status(200).send(req.body);
});

app.post("/subscribe", async (req, res) => {
    console.log("Subscription received:");
    console.log(req.body);
    const user = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.motDePasse, saltRounds);
    user.motDePasse = hashedPassword;
    const db = client.db("integrativeProjectDB");
    const collection = db.collection("Users");
    await collection.insertOne(user);

    res.status(200).send(user);
});

app.post("/verifyEmail", async (req, res) => {
    const {
        courriel
    } = req.body;

    const db = client.db("integrativeProjectDB");
    const collection = db.collection("Users");

    const users = await collection.find().toArray();

    const emailExists = users.some((user) => user.courriel === courriel);

    if (emailExists) {
        res.status(400).send({
            message: "Email already exists"
        });
    } else {
        res.status(200).send({
            message: "Email is available"
        });
    }
});

app.post("/login", async (req, res) => {
    const { courriel, motDePasse } = req.body;
    console.log('req.body: ', req.body);
    console.log('motDePasse: ', motDePasse);
    console.log('courriel: ', courriel);

    const db = client.db("integrativeProjectDB");
    const collection = db.collection("Users");

    const user = await collection.findOne({ courriel });

    if (!user) {
        return res.status(400).send({ message: "Email does not exist" });
    }

    const match = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!match) {
        return res.status(400).send({ message: "Incorrect password" });
    }

    res.status(200).send({ message: "Login successful" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect();
    console.log("Server listening on port " + port);
});