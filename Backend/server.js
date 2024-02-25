require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connect } = require("./database/database");
const ngrok = require("ngrok");
const { client } = require("./database/database");
const util = require("util");
const nodemailer = require("nodemailer");
const jwtVerify = util.promisify(jwt.verify);
const authMiddleware = require("./routes/route.auth");
/*
TO RUN SERVER DO NPM START AND ON ANOTHER TERMINAL DO NPX NGROK HTTP 8080
*/
app.use(cors());
app.use(morgan("common"));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Hello World");
});

//Specify the database and collection
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");
const ActivitiesCollection = db.collection("Activities");

app.post("/", async (req, res) => {
    console.log("Webhook received:");
    console.log(req.body);

    if (req.body.post && req.body.post.post_type === "tribe_events") {
        
        const tags = Object.values(req.body.taxonomies.post_tag || {}).map(tag => tag.name);

        const eventData = {
            post_content: req.body.post.post_content,
            post_title: req.body.post.post_title,
            post_excerpt: req.body.post.post_excerpt,
            StartDate: req.body.post_meta._EventStartDate[0],
            EndDate: req.body.post_meta._EventEndDate[0],
            post_thumbnail: req.body.post_thumbnail,
            event_url: req.body.post_meta._EventURL[0],
            tags: tags,
        };

        await ActivitiesCollection.insertOne(eventData);
    }

    res.status(200).send(req.body);
});

app.post("/subscribe", async (req, res) => {
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
            text: `Click the link to verify your account: http://localhost:8080/confirm?token=${token}`,
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
app.get("/confirm", async (req, res) => {
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
app.post("/verifyEmail", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

    res.status(200).send({
        message: "Login successful",
        accessToken: accessToken,
    });
});

app.patch("/updateUser", authMiddleware, async (req, res) => {
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

app.get("/protectedRoute", authMiddleware, async (req, res) => {
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


app.get("/activities", async (req, res) => {
    try {
        const activities = await ActivitiesCollection.find().toArray();
        console.log('activities: ', activities);
        res.json(activities);  // send a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching activities' });  // send a JSON error message
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect();
    console.log("Server listening on port " + port);
});

function GenerateToken(username) {
    //return jwt.sign(username, process.env.SECRET_TOKEN);
    return jwt.sign(username, process.env.SECRET_TOKEN, {
        expiresIn: "1d",
    });
}