require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connect } = require("./database/database");
const ngrok = require("ngrok");
const { client } = require("./database/database");
const util = require("util");

const jwtVerify = util.promisify(jwt.verify);
/*
TO RUN SERVER DO NPM START AND ON ANOTHER TERMINAL DO NPX NGROK HTTP 8080
*/

app.use(cors());
app.use(morgan("common"));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Hello World");
});

//Specify the database and collection
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");
const ActivitiesCollection = db.collection("Activities");

app.post("/", async (req, res) => {
    console.log("Webhook received:");
    console.log(req.body);

    await ActivitiesCollection.insertOne(req.body);

    res.status(200).send(req.body);
});

app.post("/subscribe", async (req, res) => {
    console.log("Subscription received:");
    console.log(req.body);
    const user = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.motDePasse, saltRounds);
    user.motDePasse = hashedPassword;
    await UsersCollection.insertOne(user);

    const accessToken = GenerateToken({
        prenom: user.prenom,
        courriel: user.courriel
    });

    res.status(200).send({accessToken: accessToken});
});

app.post("/verifyEmail", async (req, res) => {
    const {
        courriel
    } = req.body;

    const users = await UsersCollection.find().toArray();

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

    const user = await UsersCollection.findOne({ courriel });

    if (!user) {
        return res.status(400).send({ message: "Email does not exist" });
    }

    const match = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!match) {
        return res.status(400).send({ message: "Incorrect password" });
    }

    const accessToken = GenerateToken({
        prenom: user.prenom,
        courriel: user.courriel,
        nom: user.nom,
        municipalite: user.municipalite,
        sports: user.sports,
        festivals: user.festivals
    });

;   res.status(200).send({ message: "Login successful", accessToken: accessToken});
});

app.patch("/updateUser", async (req, res) => {
    const updatedUser = req.body;
    console.log('updatedUser: ', updatedUser);

    const authHeader = req.headers.authorization;
    //console.log('authHeader: ', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    //console.log('token: ', token);

    if (token == null) {
        return res.sendStatus(401); // If there's no token, return a 401 status
    }
    try {
        // Use the promisified jwt.verify function with async/await
        const user = await jwtVerify(token, process.env.SECRET_TOKEN);
        console.log('user: ', user);

        console.log('user.email: ', user.courriel);
        // Use the email from the JWT payload to update the user
        const result = await UsersCollection.updateOne({ courriel: user.courriel }, { $set: updatedUser });

        if (result.modifiedCount === 1) {
            const newAccessToken = GenerateToken(updatedUser);
            res.status(200).send({ message: "User updated successfully", accessToken: newAccessToken });
        } else {
            res.status(400).send({ message: "Error updating user" });
        }
    } catch (err) {
        // If the token is not valid, return a 403 status
        return res.sendStatus(403);
    }
});

app.get('/protectedRoute', async (req, res) => {
    //console.log('req: ', req);
    const authHeader = req.headers['authorization'];
    //console.log('authHeader: ', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token: ', token);

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const user = await jwtVerify(token, process.env.SECRET_TOKEN);
        console.log('user: ', user);
        req.user = user;
        console.log('You have accessed a protected route');
        res.send(user);
    } catch (err) {
        console.log('err: ', err);
        return res.sendStatus(403);
    }
});





const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect();
    console.log("Server listening on port " + port);
});



function GenerateToken(username){
    //return jwt.sign(username, process.env.SECRET_TOKEN);
    return jwt.sign(username, process.env.SECRET_TOKEN, {expiresIn: '1d'});
}