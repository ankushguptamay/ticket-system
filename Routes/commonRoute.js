const express = require("express");
const common = express.Router();

const { login } = require('../Controllers/Admin/adminController');
const {sendOTPForForgetPassword, verifyOTP, generatePassword } = require('../Controllers/OrganizationMember/organizationMemberController');
const { getAllAssetAssignTOEmployee } = require('../Controllers/Asset/assetController');

common.post("/login", login);
common.post("/sendOTP", sendOTPForForgetPassword);
common.post("/verifyOTP", verifyOTP);
common.post("/generatePassword", generatePassword);

common.get("/assetToEmployee/:id", getAllAssetAssignTOEmployee);

module.exports = common;