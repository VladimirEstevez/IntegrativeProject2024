const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { client } = require("../database/database.js");
const authMiddleware = require("../auth.js");
const util = require("util");
const jwtVerify = util.promisify(jwt.verify);
const bcrypt = require("bcrypt");

module.exports = router;