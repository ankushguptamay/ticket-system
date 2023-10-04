const express = require("express");
const iTechnician = express.Router();

const { getMember, changePassword } = require('../Controllers/OrganizationMember/organizationMemberController');
const { myTicketForITTechnician, updateTicketByTechnician, getTicketById } = require('../Controllers/Ticket/ticketController');
const { getAllAssetForITTechnician, assignAssetToEmployeeByTechnician } = require('../Controllers/Asset/assetController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isITTechnicianPresent } = require('../Middlewares/isPresent');

iTechnician.post("/changePassword", verifyOrganizationMemberToken, isITTechnicianPresent, changePassword);
iTechnician.get("/iTechnician", verifyOrganizationMemberToken, isITTechnicianPresent, getMember);

// Ticket
iTechnician.get("/myTickets", verifyOrganizationMemberToken, isITTechnicianPresent, myTicketForITTechnician);
iTechnician.get("/myTickets/:id", verifyOrganizationMemberToken, isITTechnicianPresent, getTicketById);
iTechnician.put("/updateTicket/:id", verifyOrganizationMemberToken, isITTechnicianPresent, updateTicketByTechnician);

// Asset
iTechnician.get("/assets", verifyOrganizationMemberToken, isITTechnicianPresent, getAllAssetForITTechnician);
iTechnician.post("/assignAsset", verifyOrganizationMemberToken, isITTechnicianPresent, assignAssetToEmployeeByTechnician);

module.exports = iTechnician;