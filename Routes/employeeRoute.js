const express = require("express");
const employee = express.Router();

const { getMember, changePassword } = require('../Controllers/OrganizationMember/organizationMemberController');
const { createTicket, myTicketForEmployee, getTicketById } = require('../Controllers/Ticket/ticketController');
const { getAssignedAsset } = require('../Controllers/Asset/assetController');
const { myAssetNumber, myClosedTicket, myOpenTicket } = require('../Controllers/OrganizationMember/employeeDashboard');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isEmployeePresent } = require('../Middlewares/isPresent');
const { uploadAttachment } = require("../Middlewares/uploadAttachment");

employee.post("/changePassword", verifyOrganizationMemberToken, isEmployeePresent, changePassword);
employee.get("/employee", verifyOrganizationMemberToken, isEmployeePresent, getMember);

employee.post("/createTicket", verifyOrganizationMemberToken, isEmployeePresent, uploadAttachment.array("attachment", 10), createTicket);
employee.get("/myTickets", verifyOrganizationMemberToken, isEmployeePresent, myTicketForEmployee);
employee.get("/myTickets/:id", verifyOrganizationMemberToken, isEmployeePresent, getTicketById);

// employee.get("/myAssets", verifyOrganizationMemberToken, isEmployeePresent, getAssignedAsset);

// Dashboard
employee.get("/myAssetNumber", verifyOrganizationMemberToken, isEmployeePresent, myAssetNumber);
employee.get("/myClosedTicket", verifyOrganizationMemberToken, isEmployeePresent, myClosedTicket);
employee.get("/myOpenTicket", verifyOrganizationMemberToken, isEmployeePresent, myOpenTicket);

module.exports = employee;