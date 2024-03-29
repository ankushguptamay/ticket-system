const express = require("express");
const iTechnician = express.Router();

const { getMember, changePassword, getAllEmployee, updateMember } = require('../Controllers/OrganizationMember/organizationMemberController');
const { myTicketForResolver, updateTicketByResolver, getTicketById } = require('../Controllers/Ticket/ticketController');
const { getAllAssetForITTechnician, assignAssetToEmployeeByTechnician } = require('../Controllers/Asset/assetController');
const { getAssetCategory } = require('../Controllers/Asset/assetcategoryController');
const { myClosedTicket, myOpenTicket, myTicketNumber } = require('../Controllers/OrganizationMember/itTechnicianDashboard');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isITTechnicianPresent } = require('../Middlewares/isPresent');

iTechnician.post("/changePassword", verifyOrganizationMemberToken, isITTechnicianPresent, changePassword);
iTechnician.get("/iTechnician", verifyOrganizationMemberToken, isITTechnicianPresent, getMember);
iTechnician.put("/update", verifyOrganizationMemberToken, isITTechnicianPresent, updateMember);

// Employee
iTechnician.get("/employees", verifyOrganizationMemberToken, isITTechnicianPresent, getAllEmployee);

// Ticket
iTechnician.get("/myTickets", verifyOrganizationMemberToken, isITTechnicianPresent, myTicketForResolver);
iTechnician.get("/myTickets/:id", verifyOrganizationMemberToken, isITTechnicianPresent, getTicketById);
iTechnician.put("/updateTicket/:id", verifyOrganizationMemberToken, isITTechnicianPresent, updateTicketByResolver);

// Asset
iTechnician.get("/assets", verifyOrganizationMemberToken, isITTechnicianPresent, getAllAssetForITTechnician);
iTechnician.post("/assignAsset", verifyOrganizationMemberToken, isITTechnicianPresent, assignAssetToEmployeeByTechnician);
iTechnician.get("/assetCategories", verifyOrganizationMemberToken, isITTechnicianPresent, getAssetCategory);

// Dashboard
iTechnician.get("/myTicketNumber", verifyOrganizationMemberToken, isITTechnicianPresent, myTicketNumber);
iTechnician.get("/openTicket", verifyOrganizationMemberToken, isITTechnicianPresent, myOpenTicket);
iTechnician.get("/closedTicket", verifyOrganizationMemberToken, isITTechnicianPresent, myClosedTicket);

module.exports = iTechnician;