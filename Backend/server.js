require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { connect } = require("./database/database");
const { client } = require("./database/database");
const authMiddleware = require("./auth.js");
const registerRouter = require("./routes/registerRouter.js");
const activitiesRouter = require("./routes/activitiesRouter.js");
const userRouter = require("./routes/userRouter.js");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const reminderTask = require("./routes/reminderRouter.js");

const path = require("path");
const moment = require('moment-timezone');


//TO RUN SERVER DO NPM START AND ON ANOTHER TERMINAL DO NPX NGROK HTTP 8080

// Use the "/build" folder as a static resource for frontend
app.use("/", express.static(path.join(__dirname, "build")));

// Middleware setup
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

// Schedule the reminder task to run every day at 5 AM
//cron.schedule("0 0 5 * * *", reminderTask);
cron.schedule("*/5 * * * * *", reminderTask);
// Send email to users when a new event is added. The email is sent to the users with matching tags of the event.
app.post("/", async (req, res) => {
  console.log("Webhook received:");
  console.log(req.body);
 

  if (req.body.post && req.body.post.post_type === "tribe_events") {
    const tags = Object.values(req.body.taxonomies.post_tag || {}).map(
      (tag) => tag.name
    );

    const StartDate = moment.tz(req.body.post_meta._EventStartDate[0], 'YYYY-MM-DD HH:mm', 'America/Montreal').format('YYYY-MM-DDTHH:mm:ss');
const EndDate = moment.tz(req.body.post_meta._EventEndDate[0], 'YYYY-MM-DD HH:mm', 'America/Montreal').format('YYYY-MM-DDTHH:mm:ss');


    const eventData = {
      post_content: req.body.post.post_content,
      post_title: req.body.post.post_title,
      post_excerpt: req.body.post.post_excerpt,
      StartDate: StartDate,
      EndDate: EndDate,
      post_thumbnail: req.body.post_thumbnail,
      event_url: req.body.post_meta._EventURL[0],
      post_url: req.body.post_permalink,
      tags: tags,
    };
    console.log('EndDate: ', EndDate);
    console.log('StartDate: ', StartDate);

    const insertResult = await ActivitiesCollection.insertOne(eventData);
    const activityId = insertResult.insertedId;
    // Get all users from the database
    const users = await UsersCollection.find().toArray();

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_PROVIDER,
      auth: {
        user:process.env.RECIPIENT_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    // Send an email to each user
    for (const user of users) {
      // Find the matching tags
      const matchingTags = tags.filter((tag) => user.tags.includes(tag));

      // Check if there are any matching tags
      if (matchingTags.length > 0) {
        const postContentWithBreaks = eventData.post_content.replace(
          /\r\n/g,
          "<br>"
        );

        // Generate a unique URL for each user and each activity

        const registerUrl = `${process.env.REACT_APP_SERVER_URL}/activities/register-activity/${
          user.courriel
        }/${activityId}/${encodeURIComponent(eventData.event_url)}`;
        console.log('registerUrl: ', registerUrl);
        const testUrl = 'https://example.com';

        // Send an email to the user
        await transporter.sendMail(
          {
            from: `"Valcourt2030" <${process.env.RECIPIENT_EMAIL}>`,
            to: user.courriel,
            subject: `Nouvelle activité : ${eventData.post_title}`,
            html: `
                    <p>Une nouvelle activité a été ajoutée qui pourrait vous intéresser. L'activité a de(s) intérêt(s) qui correspondent à vos choix d'intérêt(s) : ${matchingTags.join(
                      ", "
                    )}.</p>
                    <p>${eventData.post_title} - Du ${new Date(
              eventData.StartDate
            ).toLocaleString("fr-FR", {
              dateStyle: "medium",
              timeStyle: "short",
            })} au ${new Date(eventData.EndDate).toLocaleString("fr-FR", {
              dateStyle: "medium",
              timeStyle: "short",
            })}</p>
                    <p>${postContentWithBreaks}</p>
                    <img src="${
                      eventData.post_thumbnail
                    }" alt="Image de l'activité" style="width: 100%; max-width: 600px;">
                    <p>Cliquez sur ce <a href="${
                      eventData.post_url
                    }">lien</a> pour accéder à l'événement.</p>
                    <p><a href="${registerUrl}" style="display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; cursor: pointer; border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .25rem; color: #fff; background-color: #007bff;">Cliquez sur ce bouton pour vous inscrire à l'événement !</a></p>
 
                    <p><a href="${testUrl}" style="display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; cursor: pointer; border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .25rem; color: #fff; background-color: #007bff;">CTEST TEST TEST à l'événement !</a></p>
                `,
          },
          function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          }
        );
      }
    }
  }

  res.status(200).send(req.body);
});

// This route gets all the tags and the municipalities from the database.
app.get("/data", async (req, res) => {
  const interests = await DataCollection.findOne({
    _id: new ObjectId("65e52fd998321b99c36da1dc"),
  });
  //console.log("interests: ", interests);
  const municipalities = await DataCollection.findOne({
    _id: new ObjectId("65e52fec98321b99c36da1dd"),
  });
  //console.log(" municipalities: ", municipalities);

  res.json({
    interests: interests.Interests,
    municipalities: municipalities.Municipalities,
  });
});

//Database setup
const db = client.db("integrativeProjectDB");
const ActivitiesCollection = db.collection("Activities");
const UsersCollection = db.collection("Users");
const DataCollection = db.collection("Data");

// Routes setup
app.use("/register", registerRouter);
app.use("/activities", activitiesRouter);
app.use("/user", userRouter);

//Start the server
const port = process.env.PORT;
app.listen(port, () => {
  connect();
  console.log("Server listening on port " + port);
});
