const express = require("express");
const iTechnician = express.Router();

const { getMember, changePassword } = require('../Controllers/OrganizationMember/organizationMemberController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isITTechnicianPresent } = require('../Middlewares/isPresent');

iTechnician.post("/changePassword", verifyOrganizationMemberToken, isITTechnicianPresent, changePassword);
iTechnician.get("/iTechnician", verifyOrganizationMemberToken, isITTechnicianPresent, getMember);

module.exports = iTechnician;