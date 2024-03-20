const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { client } = require("../database/database.js");
const util = require("util");
const jwtVerify = util.promisify(jwt.verify);
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { ObjectId } = require('mongodb');

//Database setup
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");
const ActivitiesCollection = db.collection("Activities");

router.get("/", async (req, res) => {
    try {
        const activities = await ActivitiesCollection.find().toArray();
        //console.log("activities: ", activities);
        res.json(activities); // send a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching activities" }); // send a JSON error message
    }
});

router.post("/register-activity", async (req, res) => {
    const token = req.headers["authorization"];
    //console.log('token: ', token);
    const activity = req.body;

    if (!token) {
        return res.status(403).send({ message: "No token provided" });
    }

    jwt.verify(token, process.env.SECRET_TOKEN, async (err, decoded) => {
        
        if (err) {
            return res.status(500).send({ message: "Failed to authenticate token" });
        }

        const user = await UsersCollection.findOne({ courriel: decoded.courriel });
        console.log('user: ', user);

        if (!user) {
            return res.status(404).send({ message: "No user found" });
        }

        await ActivitiesCollection.updateOne(
            { _id: new ObjectId(activity._id) },
            { $addToSet: { registeredUsers: user.courriel } });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "integrativeprojectgroupthree@gmail.com",
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: '"Valcour2030" <integrativeprojectgroupthree@gmail.com>',
            to: user.courriel,
            subject: "Activity Registration",
            html: `
            <p>You have registered to the activity: ${activity.post_title}.</p>
            <p>Start Date: ${activity.StartDate}, End Date: ${activity.EndDate}.</p>
            <p>More details at: <a href="${activity.event_url}">${activity.event_url}</a></p>
            <img src="${activity.post_thumbnail}" alt="Activity Image" style="width: 100%; max-width: 600px;">
            `,
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res.status(200).send({ message: "Activity registration successful" });
    });
});

router.get("/register-activity/:email/:activityId/:formUrl", async (req, res) => {
    const email = req.params.email;
    const activityId = req.params.activityId;
    const formUrl = decodeURIComponent(req.params.formUrl);

    const user = await UsersCollection.findOne({ courriel: email });

    if (!user) {
        return res.status(404).send({ message: "No user found" });
    }

    await ActivitiesCollection.updateOne(
        { _id: new ObjectId(activityId) },
        { $addToSet: { registeredUsers: email } }
    );

    // Redirect to the form URL
    res.redirect(formUrl);
});

router.get("/my-activities", async (req, res) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('No token provided');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const userEmail = decoded.courriel;

    // Find the activities the user is registered to
    try {
        const activities = await ActivitiesCollection.find({
            registeredUsers: { $in: [userEmail] }
        }).toArray();

        if (!activities) {
            return res.status(404).send('No activities found');
        }
        res.send(activities);
    } catch (error) {
        console.error("Error in find operation: ", error);
        return res.status(500).send('Server error');
    }
});

module.exports = router;
