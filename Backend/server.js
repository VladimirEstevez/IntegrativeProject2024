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

//Database setup
const db = client.db("integrativeProjectDB");
const ActivitiesCollection = db.collection("Activities")

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