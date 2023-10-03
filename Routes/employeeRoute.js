const express = require("express");
const employee = express.Router();

const { getMember, changePassword } = require('../Controllers/OrganizationMember/organizationMemberController');
const { createTicket, myTicketForEmployee } = require('../Controllers/Ticket/ticketController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isEmployeePresent } = require('../Middlewares/isPresent');
const { uploadAttachment } = require("../Middlewares/uploadAttachment");

employee.post("/changePassword", verifyOrganizationMemberToken, isEmployeePresent, changePassword);
employee.get("/employee", verifyOrganizationMemberToken, isEmployeePresent, getMember);

employee.post("/createTicket", verifyOrganizationMemberToken, isEmployeePresent, uploadAttachment.array("attachment", 10), createTicket);

module.exports = employee;