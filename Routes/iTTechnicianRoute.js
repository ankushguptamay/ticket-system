const express = require("express");
const iTechnician = express.Router();

const { getMember, changePassword, getAllEmployee } = require('../Controllers/OrganizationMember/organizationMemberController');
const { myTicketForITTechnician, updateTicketByTechnician, getTicketById } = require('../Controllers/Ticket/ticketController');
const { getAllAssetForITTechnician, assignAssetToEmployeeByTechnician } = require('../Controllers/Asset/assetController');
const { getAssetCategory } = require('../Controllers/Asset/assetcategoryController');
const { myClosedTicket, myOpenTicket, myTicketNumber } = require('../Controllers/OrganizationMember/itTechnicianDashboard');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isITTechnicianPresent } = require('../Middlewares/isPresent');

iTechnician.post("/changePassword", verifyOrganizationMemberToken, isITTechnicianPresent, changePassword);
iTechnician.get("/iTechnician", verifyOrganizationMemberToken, isITTechnicianPresent, getMember);

// Employee
iTechnician.get("/employees", verifyOrganizationMemberToken, isITTechnicianPresent, getAllEmployee);

// Ticket
iTechnician.get("/myTickets", verifyOrganizationMemberToken, isITTechnicianPresent, myTicketForITTechnician);
iTechnician.get("/myTickets/:id", verifyOrganizationMemberToken, isITTechnicianPresent, getTicketById);
iTechnician.put("/updateTicket/:id", verifyOrganizationMemberToken, isITTechnicianPresent, updateTicketByTechnician);

// Asset
iTechnician.get("/assets", verifyOrganizationMemberToken, isITTechnicianPresent, getAllAssetForITTechnician);
iTechnician.post("/assignAsset", verifyOrganizationMemberToken, isITTechnicianPresent, assignAssetToEmployeeByTechnician);
iTechnician.get("/assetCategories", verifyOrganizationMemberToken, isITTechnicianPresent, getAssetCategory);

// Dashboard
iTechnician.get("/myTicketNumber", verifyOrganizationMemberToken, isITTechnicianPresent, myTicketNumber);
iTechnician.get("/openTicket", verifyOrganizationMemberToken, isITTechnicianPresent, myOpenTicket);
iTechnician.get("/closedTicket", verifyOrganizationMemberToken, isITTechnicianPresent, myClosedTicket);

module.exports = iTechnician;