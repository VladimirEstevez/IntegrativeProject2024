const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { client } = require("../database/database.js");
const authMiddleware = require("../auth.js");
const util = require("util");
const jwtVerify = util.promisify(jwt.verify);
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//Database setup
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");

function GenerateToken(username) {
  //return jwt.sign(username, process.env.SECRET_TOKEN);
  return jwt.sign( username , process.env.SECRET_TOKEN, {
    expiresIn: "1d",
  });
}

router.post("/login", async (req, res) => {
  const { courriel, motDePasse } = req.body;
  console.log("req.body: ", req.body);
  console.log("motDePasse: ", motDePasse);
  console.log("courriel: ", courriel);

  const user = await UsersCollection.findOne({
    courriel,
  });

  if (user) {
    if (!user.verified) {
      res.status(401).send({
        message:
          "Veuillez vérifier votre courriel et confirmer votre compte avant votre première connexion.",
      });
      return;
    }
  }

  if (!user) {
    return res.status(400).send({
      message: "Ce courriel n'existe pas ou le mot de passe est incorrect",
    });
  }

  const match = await bcrypt.compare(motDePasse, user.motDePasse);

  if (!match) {
    return res.status(400).send({
      message: "Ce courriel n'existe pas ou le mot de passe est incorrect",
    });
  }

  const accessToken = GenerateToken({
    prenom: user.prenom,
    courriel: user.courriel,
    nom: user.nom,
    municipalite: user.municipalite,
    tags: user.tags,
  });

  console.log("RIGHT TOKEN: ", accessToken);
  res.status(200).send({
    message: "Login successful",
    accessToken: accessToken,
  });
});

router.patch("/updateUser", authMiddleware, async (req, res) => {
  const updatedUser = req.body;
  console.log("updatedUser: ", updatedUser);

  const authHeader = req.headers.authorization;
  //console.log('authHeader: ', authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  //console.log('token: ', token);

  if (token == null) {
    return res.sendStatus(401); // If there's no token, return a 401 status
  }
  try {
    // Use the promisified jwt.verify function with async/await
    const user = await jwtVerify(token, process.env.SECRET_TOKEN);
    console.log("user: ", user);

    console.log("user.email: ", user.courriel);
    // Use the email from the JWT payload to update the user
    const result = await UsersCollection.updateOne(
      {
        courriel: user.courriel,
      },
      {
        $set: updatedUser,
      }
    );

    if (result.modifiedCount === 1) {
      updatedUser.courriel = user.courriel;
      const newAccessToken = GenerateToken(updatedUser);
      res.status(200).send({
        message: "User updated successfully",
        accessToken: newAccessToken,
      });
    } else {
      res.status(400).send({
        message: "Error updating user",
      });
    }
  } catch (err) {
    // If the token is not valid, return a 403 status
    return res.sendStatus(403);
  }
});

router.get("/protectedRoute", authMiddleware, async (req, res) => {
  //console.log('req: ', req);
  const authHeader = req.headers["authorization"];
  //console.log('authHeader: ', authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token: ", token);

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = await jwtVerify(token, process.env.SECRET_TOKEN);
    console.log("user: ", user);
    req.user = user;
    console.log("You have accessed a protected route");
    res.send(user);
  } catch (err) {
    console.log("err: ", err);
    return res.sendStatus(403);
  }
});

//ROUTE TO VERIFY IF EMAIL THAT EMAIL EXISTS,
// IT CHECKS IF THE EMAIL HAS BEEN ALREADY TAKEN IN THE DATABASE BEFORE LETTING THE USER RESET THE PASSWORD
router.post("/verifyEmail", async (req, res) => {
  const courriel = req.body.courriel;

  const users = await UsersCollection.find().toArray();

  const emailExists = users.some((user) => user.courriel === courriel);

  if (!emailExists) {
    res.status(400).send({
      message: "Ce courriel n'existe pas",
    });
  } else {
    res.status(200).send({
      message: "Courriel vérifié avec succès",
    });
  }
});

router.post("/requestPasswordReset", async (req, res) => {
  const userCourriel = req.body.courriel;

  // Generate a unique token and associate it with the user's account
  const token = GenerateToken({userCourriel});
  await UsersCollection.updateOne(
    {courriel: userCourriel },
    { $set: {resetPasswordToken: token } }
  )

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "integrativeprojectgroupthree@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail(
    {
      from: '"Valcour2030" <integrativeprojectgroupthree@gmail.com>',
      to: userCourriel,
      subject: "Reset password",
      text: `Click the link to reset your password: http://localhost:8080/user/resetPassword?token=${token}`,
    },
    function (error, info) {
      if (error) {
        res.status(400).send("Nous n'avons pas pu vous envoyer le courriel de réinitialisation du mot de passe.");
      } else {
        res.status(200).send("Vérifiez votre courriel pour réinitialiser votre mot de passe");
      }
    }
  );
});

// This route handles the initial GET request made when the user clicks the link in the email
router.get("/resetPassword", async (req, res) => {
  const { token } = req.query;

  // Redirect to the reset password page in the React app
  res.redirect(`http://localhost:3000/resetPassword?token=${token}`);
});

// This route handles the POST request made by your React app to reset the password
router.post("/resetPassword", async (req, res) => {
  const { token, password } = req.body;
  const user = await UsersCollection.findOne({ resetPasswordToken: token });

  if (!user) {
    // If the token is not associated with a user, send an error message
    res.status(400).send("Invalid token");
  } else{
    // If the token is valid, hash the new password and update it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await UsersCollection.findOneAndUpdate(
      {resetPasswordToken: token},
      { $set: {motDePasse: hashedPassword, resetPasswordToken: null } }
    )
    
    res.status(200).send("Password reset successful");
  }
});

module.exports = router;
