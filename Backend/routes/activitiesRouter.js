const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { client } = require("../database/database.js");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");
const authMiddleware = require("../auth.js");
//Database setup
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");
const ActivitiesCollection = db.collection("Activities");


// This route returns a collection of activities from the database.
router.get("/", async (req, res) => {
  try {
    const activities = await ActivitiesCollection.find().toArray();
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching activities" }); // send a JSON error message
  }
});

// This route registers a user to an activity and sends an email to the user.
router.post("/register-activity", authMiddleware, async (req, res) => {
  const token = req.headers['authorization'];
  console.log('token: ', token);

  const activity = req.body;
  console.log('activity: ', activity);

  const user = await UsersCollection.findOne({ courriel: decoded.courriel });
  console.log('user: ', user);

  if (!user) {
    return res.status(404).send({ message: "No user found" });
  }

  await ActivitiesCollection.updateOne(
    { _id: new ObjectId(activity._id) },
    { $addToSet: { registeredUsers: user.courriel } }
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.RECIPIENT_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

   await transporter.sendMail({
            from: `"Valcourt2030" <${process.env.RECIPIENT_EMAIL}>`,
            to: user.courriel,
            subject: "Inscription à une activité",
            html: `
            Bienvenue! Vous vous êtes inscrit à l'activité : ${activity.post_title}.<br>
                Date de début : ${(activity.StartDate).toLocaleString('fr-FR')},<br>
                Date de fin : ${(activity.EndDate).toLocaleString('fr-FR')}.<br>
                Tags : ${activity.tags.join(', ')}<br>
                <p>Pour plus de détails, cliquez sur le bouton ci-dessous :
                <button id="detailsButton" style="background-color: blue; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Voir les détails</button></p>

            <img src="${
              activity.post_thumbnail
            }" alt="Image de l'activité" style="width: 100%; max-width: 600px;">
            
            <script>
                // Ajout d'un gestionnaire d'?v?nements au clic du bouton
                document.getElementById("detailsButton").addEventListener("click", function() {
                window.location.href = "${activity.event_url}";
                });
            </script>
        `,
    },
    function (error, info) {
      if (error) {
        console.log(error);
        console.log('info: ', info);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );

  res.status(200).send({ message: "Activity registration successful" });
});

// This route registers the user to an activity when the user clicks the "Register" button on the email notification and opens up the form to register for the activity.
router.get(
  "/register-activity/:email/:activityId/:formUrl",
  async (req, res) => {
    //console.log("les activit�s; form;");
    const email = req.params.email;
    const activityId = req.params.activityId;
    const formUrl = decodeURIComponent(req.params.formUrl);

    const user = await UsersCollection.findOne({ courriel: email });
    console.log('user: ', user);

    if (!user) {
      return res.status(404).send({ message: "No user found" });
    }

    await ActivitiesCollection.updateOne(
      { _id: new ObjectId(activityId) },
      { $addToSet: { registeredUsers: email } }
    );

    // Redirect to the form URL
    res.redirect(formUrl);
  }
);

// This route gets the user email from decoding the token, and returns the registered activities for that user.
router.get("/my-activities", async (req, res) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("No token provided");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
  const userEmail = decoded.courriel;

  // Find the activities the user is registered to
  try {
    const activities = await ActivitiesCollection.find({
      registeredUsers: { $in: [userEmail] },
    }).toArray();

    if (!activities) {
      return res.status(404).send("No activities found");
    }
    res.send(activities);
  } catch (error) {
    console.error("Error in find operation: ", error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;