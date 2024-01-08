const express = require("express");
const employee = express.Router();

const { getMember, changePassword } = require('../Controllers/OrganizationMember/organizationMemberController');
const { createTicket, myTicketForEmployee, getTicketById } = require('../Controllers/Ticket/ticketController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isEmployeePresent } = require('../Middlewares/isPresent');
const { uploadAttachment } = require("../Middlewares/uploadAttachment");

employee.post("/changePassword", verifyOrganizationMemberToken, isEmployeePresent, changePassword);
employee.get("/employee", verifyOrganizationMemberToken, isEmployeePresent, getMember);

employee.post("/createTicket",  uploadAttachment.array("attachment", 10), createTicket);
employee.get("/myTickets", verifyOrganizationMemberToken, isEmployeePresent, myTicketForEmployee);
employee.get("/myTickets/:id", verifyOrganizationMemberToken, isEmployeePresent, getTicketById);

module.exports = employee;