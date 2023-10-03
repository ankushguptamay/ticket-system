const express = require("express");
const admin = express.Router();

const { register, getAdmin, changePassword } = require('../Controllers/Admin/adminController');
const { registerMember, getAllMember } = require('../Controllers/OrganizationMember/organizationMemberController');
const { ticketForAdmin } = require('../Controllers/Ticket/ticketController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isAdminPresent } = require('../Middlewares/isPresent');

admin.post("/register", register);
admin.post("/changePassword", verifyOrganizationMemberToken, isAdminPresent, changePassword);
admin.get("/admin", verifyOrganizationMemberToken, isAdminPresent, getAdmin);

// Organization Member
admin.post("/registerMember", verifyOrganizationMemberToken, isAdminPresent, registerMember);
admin.get("/employees", verifyOrganizationMemberToken, isAdminPresent, getAllMember);

// Ticket
admin.get("/tickets", verifyOrganizationMemberToken, isAdminPresent, ticketForAdmin);

module.exports = admin;