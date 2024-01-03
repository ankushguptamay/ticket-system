const express = require("express");
const common = express.Router();

const { login } = require('../Controllers/Admin/adminController');
const { getAllAssetAssignTOEmployee } = require('../Controllers/Asset/assetController');

common.post("/login", login);

common.get("/assetToEmployee/:id", getAllAssetAssignTOEmployee);

module.exports = common;