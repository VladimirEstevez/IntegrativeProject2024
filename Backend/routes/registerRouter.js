const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { client } = require("../database/database");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

//Database setup
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");
const ActivitiesCollection = db.collection("Activities");

// router.post("/", async (req, res) => {
//   console.log("Webhook received:");
//   console.log(req.body);

//   await ActivitiesCollection.insertOne(req.body);

//   res.status(200).send(req.body);
// });

router.post("/subscribe", async (req, res) => {
  console.log("Subscription received:");
  console.log(req.body);
  const user = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.motDePasse, saltRounds);
  user.motDePasse = hashedPassword;
  user.verified = false; // Add a verified field set to false
  const result = await UsersCollection.insertOne(user);
  //const savedUser = result.ops[0]; // Get the saved user with _id

  // Generate a verification token
  const token = jwt.sign({
          email: user.courriel,
      },
      process.env.SECRET_TOKEN
  );

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
          subject: "Verify your account",
          text: `Click the link to verify your account: http://localhost:8080/register/confirm?token=${token}`,
      },
      function (error, info) {
          if (error) {
              console.log(error);
          } else {
              console.log("Email sent: " + info.response);
          }
      }
  );
  res.status(200).send({
      message: "User created successfully",
  });
});
//ROUTE TO CONFIRM EMAIL WHEN USER REGISTERS TO THE FIRST TIME
//AN EMAIL GETS SENT AND HE HAS TO CLICK ON A LINK BEFORE BEING ABLE TO SIGN IN FOR THE FIRST TIME
router.get("/confirm", async (req, res) => {
  const token = req.query.token;

  try {
      // Verify the token
      const payload = jwt.verify(token, process.env.SECRET_TOKEN);

      // Find the user and mark them as verified
      const result = await UsersCollection.updateOne({
          courriel: payload.email,
      }, {
          $set: {
              verified: true,
          },
      });

      if (result.modifiedCount === 1) {
          res.send("Votre compte a été vérifié!");
      } else {
          res.status(400).send("Error verifying account");
      }
  } catch (err) {
      console.error(err);
      res.status(400).send("Invalid token");
  }
});


//ROUTE TO VERIFY IF EMAIL EXISTS ALREADY WHEN USER IS REGISTERING FOR THE FIRST TIME
// IT CHECKS IF THE EMAIL HAS BEEN ALREADY TAKEN IN THE DATABASE BEFORE LETTING THE USER REGISTER
router.post("/verifyEmail", async (req, res) => {
  const {
      courriel
  } = req.body;

  const users = await UsersCollection.find().toArray();

  const emailExists = users.some((user) => user.courriel === courriel);

  if (emailExists) {
      res.status(400).send({
          message: "Ce courriel existe déjà",
      });
  } else {
      res.status(200).send({
          message: "Email is available",
      });
  }
});

module.exports = router;