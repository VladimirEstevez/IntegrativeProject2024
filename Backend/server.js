require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { connect } = require("./database/database");
const ngrok = require("ngrok");
const { client } = require("./database/database");
const authMiddleware = require("./auth.js");
const registerRouter = require("./routes/registerRouter.js");
const activitiesRouter = require("./routes/activitiesRouter.js");
const userRouter = require("./routes/userRouter.js");
const { ObjectId } = require('mongodb'); 
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const reminderTask = require('./routes/reminderRouter.js');
const moment = require('moment');

//TO RUN SERVER DO NPM START AND ON ANOTHER TERMINAL DO NPX NGROK HTTP 8080

// Middleware setup
app.use(cors());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Hello World");
});

cron.schedule('0 0 * * *', reminderTask);

app.post("/", async (req, res) => {
    console.log("Webhook received:");
    console.log(req.body);
    
    function adjustDate(dateString) {
        var date = new Date(dateString);
        var userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - userTimezoneOffset);
    }

    if (req.body.post && req.body.post.post_type === "tribe_events") {

        const tags = Object.values(req.body.taxonomies.post_tag || {}).map(tag => tag.name);

        const eventData = {
            post_content: req.body.post.post_content,
            post_title: req.body.post.post_title,
            post_excerpt: req.body.post.post_excerpt,
            StartDate: adjustDate(req.body.post_meta._EventStartDate[0]),
            EndDate: adjustDate(req.body.post_meta._EventEndDate[0]),
            post_thumbnail: req.body.post_thumbnail,
            event_url: req.body.post_meta._EventURL[0],
            post_url: req.body.post_permalink,
            tags: tags,
        };

        const formattedStartDate = moment(eventData.StartDate).format('YYYY-MM-DD hh:mm A');
const formattedEndDate = moment(eventData.EndDate).format('YYYY-MM-DD hh:mm A');

        const insertResult = await ActivitiesCollection.insertOne(eventData);
        const activityId = insertResult.insertedId;
          // Get all users from the database
        const users = await UsersCollection.find().toArray();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "integrativeprojectgroupthree@gmail.com",
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        // Send an email to each user
for (const user of users) {
    // Find the matching tags
    const matchingTags = tags.filter(tag => user.tags.includes(tag));

    // Check if there are any matching tags
    if (matchingTags.length > 0) {

        const postContentWithBreaks = eventData.post_content.replace(/\r\n/g, '<br>');

        // Generate a unique URL for each user and each activity

        const registerUrl = `http://localhost:8080/activities/register-activity/${user.courriel}/${activityId}/${encodeURIComponent(eventData.event_url)}`;

        // Send an email to the user
        await transporter.sendMail({
            from: '"Valcour2030" <integrativeprojectgroupthree@gmail.com>',
            to: user.courriel,
            subject: `New Activity: ${eventData.post_title}`,
            html: `
                <p>A new activity has been added that might interest you. The activity has the following tag(s) that match your interests: ${matchingTags.join(', ')}.</p>
                <p>${eventData.post_title} - ${formattedStartDate} to ${formattedEndDate}</p>
                <p>${postContentWithBreaks}</p>
                <img src="${eventData.post_thumbnail}" alt="Activity Image" style="width: 100%; max-width: 600px;">
                <p>Click on this <a href="${eventData.post_url}">URL</a> to go to the event.</p>
                <p><a href="${registerUrl}" style="display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; cursor: pointer; border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .25rem; color: #fff; background-color: #007bff;">Click on this button to register to the event!</a></p>
 
                `,
        }, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    }
}

    }

    res.status(200).send(req.body);
});

//Database setup
const db = client.db("integrativeProjectDB");
const ActivitiesCollection = db.collection("Activities")
const UsersCollection = db.collection("Users")
const DataCollection = db.collection("Data")
app.get("/data", async (req, res) => {
    const interests = await DataCollection.findOne({ _id: new ObjectId("65e52fd998321b99c36da1dc") });
    console.log('interests: ', interests);
    const municipalities = await DataCollection.findOne({ _id: new ObjectId("65e52fec98321b99c36da1dd") });
    console.log(' municipalities: ',  municipalities);
  
    res.json({ interests: interests.Interests, municipalities: municipalities.Municipalities });
  });
// Routes setup
app.use("/register", registerRouter);
app.use("/activities", activitiesRouter);
app.use("/user", userRouter);

//Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect();
    console.log("Server listening on port " + port);
});