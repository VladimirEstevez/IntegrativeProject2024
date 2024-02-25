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

//TO RUN SERVER DO NPM START AND ON ANOTHER TERMINAL DO NPX NGROK HTTP 8080

// Middleware setup
app.use(cors());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Hello World");
});

//Database setup
const db = client.db("integrativeProjectDB");
const UsersCollection = db.collection("Users");

// Routes setup
app.use("/register", registerRouter);
app.use("/activities", authMiddleware, activitiesRouter);
app.use("/user", userRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect();
    console.log("Server listening on port " + port);
});