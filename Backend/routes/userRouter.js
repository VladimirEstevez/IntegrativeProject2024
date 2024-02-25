const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { client } = require("../database/database.js");
const authMiddleware = require("../auth.js");
const util = require("util");
const jwtVerify = util.promisify(jwt.verify);
const bcrypt = require("bcrypt");

//Database setup
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");

function GenerateToken(username) {
    //return jwt.sign(username, process.env.SECRET_TOKEN);
    return jwt.sign(username, process.env.SECRET_TOKEN, {
        expiresIn: "1d",
    });
}

router.post("/login", async (req, res) => {
    const {
        courriel,
        motDePasse
    } = req.body;
    console.log("req.body: ", req.body);
    console.log("motDePasse: ", motDePasse);
    console.log("courriel: ", courriel);

    const user = await UsersCollection.findOne({
        courriel,
    });

    if (user) {
        if (!user.verified) {
            res
                .status(401)
                .send({

                    message: "Veuillez vérifier votre courriel et confirmer votre compte avant votre première connexion."
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
        sports: user.sports,
        festivals: user.festivals,
    });
    
    console.log('RIGHT TOKEN: ', accessToken);
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
        const result = await UsersCollection.updateOne({
            courriel: user.courriel,
        }, {
            $set: updatedUser,
        });

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

module.exports = router;