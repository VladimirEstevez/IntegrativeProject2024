const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    client
} = require("../database/database");
const nodemailer = require("nodemailer");
const cron = require('node-cron');


const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");
const ActivitiesCollection = db.collection("Activities");

// Schedule a task to run once a day at 12:00 AM
cron.schedule('0 0 * * *', async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "integrativeprojectgroupthree@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);



    // Get all users from the database
    const users = await UsersCollection.find().toArray();

    // Send an email to each user
    for (const user of users) {
        const activities = await ActivitiesCollection.find({
            StartDate: {
                $gte: currentDate,
                $lt: nextDate,
            },
            tags: {
                $in: user.tags,
            },
        }).toArray();

        // If there are any activities, send an email to the user
        if (activities.length > 0) {
            let text = `Hello, today is ${currentDate.toLocaleDateString()}\n\nActivities happening tomorrow:\n`;

            // Add each activity to the email text
            for (const activity of activities) {
                text += `\n${activity.post_title} - ${activity.StartDate} to ${activity.EndDate}\n${activity.post_content}\n`;
            }

            await transporter.sendMail({
                from: '"Valcour2030" <integrativeprojectgroupthree@gmail.com>',
                to: user.courriel,
                subject: "Daily email",
                text: text,
            }, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        }
    }
});