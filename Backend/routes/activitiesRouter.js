const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { client } = require("../database/database.js");
const util = require("util");
const jwtVerify = util.promisify(jwt.verify);
const bcrypt = require("bcrypt");

//Database setup
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");
const ActivitiesCollection = db.collection("Activities");

router.get("/", async (req, res) => {
    try {
        const activities = await ActivitiesCollection.find().toArray();
        console.log('activities: ', activities);
        res.json(activities);  // send a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching activities' });  // send a JSON error message
    }
});

module.exports = router;