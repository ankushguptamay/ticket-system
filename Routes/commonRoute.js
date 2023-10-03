const express = require("express");
const common = express.Router();

const { login } = require('../Controllers/Admin/adminController');

common.post("/login", login);

module.exports = common;