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
  ////console.log("req.body: ", req.body);
  ////console.log("motDePasse: ", motDePasse);
  ////console.log("courriel: ", courriel);

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
 
  if (!user || !match) {
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

  //console.log("RIGHT TOKEN: ", accessToken);
  res.status(200).send({
    message: "Login successful",
    accessToken: accessToken,
  });
});

router.patch("/updateUser", authMiddleware, async (req, res) => {
  const updatedUser = req.body;
  ////console.log("updatedUser: ", updatedUser);

  const authHeader = req.headers.authorization;
  ////console.log('authHeader: ', authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  ////console.log('token: ', token);

  if (token == null) {
    return res.sendStatus(401); // If there's no token, return a 401 status
  }
  try {
    // Use the promisified jwt.verify function with async/await
   const user = req.user
    ////console.log("user: ", user);

    ////console.log("user.email: ", user.courriel);
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
  ////console.log('req: ', req);
  const authHeader = req.headers["authorization"];
  ////console.log('authHeader: ', authHeader);
  const token = authHeader && authHeader.split(" ")[1];
 // //console.log("token: ", token);

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    // const user = await jwtVerify(token, process.env.SECRET_TOKEN);
    // ////console.log("user: ", user);
    // req.user = user;
    //console.log("You have accessed a protected route");
    res.status(200).send(req.user);
  } catch (err) {
    //console.log("err: ", err);
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
    service: process.env.EMAIL_PROVIDER,
    auth: {
      user:process.env.RECIPIENT_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Valcour2030" <process.env.RECIPIENT_EMAIL>',
    to: userCourriel,
    subject: "Réinitialisation du mot de passe",
    html: `
      <p>Cliquez sur le bouton suivant pour réinitialiser votre mot de passe :
      <a href="${process.env.REACT_APP_SERVER_URL}/user/resetPassword?token=${token}" style="display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; cursor: pointer; border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem;
       line-height: 1.5; border-radius: .25rem; color: #fff; background-color: #007bff; text-decoration: none;">Réinitialiser le mot de passe</a></p>
      <img src="https://valfamille.com/site2022/wp-content/uploads/logo-bleu-marge.jpg" alt="Valcourt 2030" style="max-width: 60%; max-height: 50vh; margin-bottom: 20px;">

      `
  
  
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
  res.redirect(`${process.env.SERVER_URL}/resetPassword?token=${token}`);
});

// This route handles the POST request made by your React app to reset the password
router.post("/resetPassword", async (req, res) => {
  const { token, password } = req.body;
  const user = await UsersCollection.findOne({ resetPasswordToken: token });

  if (!user) {
    // If the token is not associated with a user, send an error message
    res.status(400).send("Impossible de traiter votre demande. Veuillez réessayer");
  } else{
    // If the token is valid, hash the new password and update it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await UsersCollection.findOneAndUpdate(
      {resetPasswordToken: token},
      { $set: {motDePasse: hashedPassword, resetPasswordToken: null } }
    )
    
    res.status(200).send("Réinitialisation du mot de passe réussie");
  }
});

router.get("/requestPasswordModification", authMiddleware, async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header is missing');
  }

  const token = authHeader.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const userCourriel = decodedToken.courriel;

  // Generate a unique token and associate it with the user's account
  const newToken = GenerateToken({userCourriel});
  //console.log('newToken: ', newToken);
  await UsersCollection.updateOne(
    {courriel: userCourriel },
    { $set: {modifyPasswordToken: newToken } }
  )

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
      user:process.env.RECIPIENT_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail(
    {
      from: '"Valcourt2030" <process.env.RECIPIENT_EMAIL>',
      to: userCourriel,
      subject: "Modification du mot de passe ",
      html: `
    <p>Cliquez sur le lien ci-dessous pour modifier votre mot de passe :</p>
    <p><a href="${process.env.REACT_APP_SERVER_URL}/user/passwordModification?token=${encodeURIComponent(newToken)}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Modifier le mot de passe</a></p>
  `,
    },
    function (error, info) {
      if (error) {
        res.status(400).send("Nous n'avons pas pu vous envoyer le courriel de modification du mot de passe.");
      } else {
        res.status(200).send("Vérifiez votre courriel pour modifier votre mot de passe");
      }
    }
  );
});

// This route handles the initial GET request made when the user clicks the link in the email
router.get("/passwordModification", async (req, res) => {
  const { token } = req.query;
  console.log("token: " + token)

  // Redirect to the reset password page in the React app
  res.redirect(`${process.env.SERVER_URL}/passwordModification?token=${token}`);
});

// This route handles the POST request made by your React app to reset the password
router.post("/passwordModification", async (req, res) => {
  const { token, password } = req.body;
  const user = await UsersCollection.findOne({ modifyPasswordToken: token });

  if (!user) {
    // If the token is not associated with a user, send an error message
    res.status(400).send("Impossible de traiter votre demande. Veuillez réessayer");
  } else{
    // If the token is valid, hash the new password and update it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await UsersCollection.findOneAndUpdate(
      {modifyPasswordToken: token},
      { $set: {motDePasse: hashedPassword, modifyPasswordToken: null } }
    )

    res.status(200).send("Modification du mot de passe réussie");
  }
});

module.exports = router;
