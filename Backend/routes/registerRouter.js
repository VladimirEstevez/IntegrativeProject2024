const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    client
} = require("../database/database");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

//Database setup
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");

// router.post("/", async (req, res) => {
//   //console.log("Webhook received:");
//   //console.log(req.body);

//   await ActivitiesCollection.insertOne(req.body);

//   res.status(200).send(req.body);
// });

router.post("/subscribe", async (req, res) => {
    //console.log("Subscription received:");
    //console.log(req.body);
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
            user:process.env.RECIPIENT_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });


    await transporter.sendMail({
        from: '"Valcourt2030" <integrativeprojectgroupthree@gmail.com>',
        to: user.courriel,
        subject: "Vérification de votre compte",
        html: `
            <h1>Bienvenue à Valcourt2030</h1>
            <p>Merci de vous être inscrit(e) avec nous ! Veuillez cliquer sur le bouton ci-dessous pour vérifier votre compte :</p>
            <a href="${process.env.REACT_APP_SERVER_URL}/register/confirm?token=${token}" style="background-color: #0098d9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Vérifier votre compte</a>
        `,
    }, function(error, info) {
        if (error) {
            //console.log(error);
        } else {
            //console.log("Email sent: " + info.response);
        }
    });
  res.status(200).send({
      message: "User created successfully",
  });
});
// USER REGISTERS TO THE FIRST TIME
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
            res.send(`<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 80vh; font-family: 'Arial', sans-serif;">
            <h1 style="font-size: 5vw;"></h1>
            <img src="https://valfamille.com/site2022/wp-content/uploads/logo-bleu-marge.jpg" alt="Valcourt 2030" style="max-width: 60%; max-height: 50vh; margin-bottom: 20px;">
            <div style="text-align: center;">
                <h1 style="font-size: 5vw;">Votre compte a été vérifié!</h1>
                <p style="font-size: 3vw;">Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter à votre compte.</p>
            </div>
        </div>`);
        } else {
            res.status(400).send(`<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 80vh; font-family: 'Arial', sans-serif;">
            <h1 style="font-size: 5vw;"></h1>
            <img src="https://valfamille.com/site2022/wp-content/uploads/logo-bleu-marge.jpg" alt="Valcourt 2030" style="max-width: 60%; max-height: 50vh; margin-bottom: 20px;">
            <h1 style="font-size: 3vw;">Erreur de vérification du compte</h1>
            <p style="font-size: 1vw;">Une erreur s'est produite lors de la vérification du compte. Veuillez réessayer plus tard.</p>
        </div>`);
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