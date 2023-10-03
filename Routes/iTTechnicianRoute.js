const express = require("express");
const iTechnician = express.Router();

const { getMember, changePassword } = require('../Controllers/OrganizationMember/organizationMemberController');
const { myTicketForITTechnician, updateTicketByTechnician } = require('../Controllers/Ticket/ticketController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isITTechnicianPresent } = require('../Middlewares/isPresent');

iTechnician.post("/changePassword", verifyOrganizationMemberToken, isITTechnicianPresent, changePassword);
iTechnician.get("/iTechnician", verifyOrganizationMemberToken, isITTechnicianPresent, getMember);

iTechnician.get("/myTickets", verifyOrganizationMemberToken, isITTechnicianPresent, myTicketForITTechnician);
iTechnician.put("/updateTicket/:id", verifyOrganizationMemberToken, isITTechnicianPresent, updateTicketByTechnician);

module.exports = iTechnician;