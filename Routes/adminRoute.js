const express = require("express");
const admin = express.Router();

const { register, login, getAdmin, changePassword } = require('../Controllers/Admin/adminController');
const { registerMember } = require('../Controllers/OrganizationMember/organizationMemberController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isAdminPresent } = require('../Middlewares/isPresent');

admin.post("/register", register);
admin.post("/login", login);
admin.post("/changePassword", verifyOrganizationMemberToken, isAdminPresent, changePassword);
admin.get("/admin", verifyOrganizationMemberToken, isAdminPresent, getAdmin);

// Organization Member
admin.post("/registerMember", verifyOrganizationMemberToken, isAdminPresent, registerMember);

module.exports = admin;