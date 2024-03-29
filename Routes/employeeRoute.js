const express = require("express");
const employee = express.Router();

const { getMember, changePassword, updateMember, getMyAllAsset } = require('../Controllers/OrganizationMember/organizationMemberController');
const { createTicket, myTicketForEmployee, getTicketById, updateTicketByEmployee, deleteAttachmentFile } = require('../Controllers/Ticket/ticketController');
const { myAssetNumber, myClosedTicket, myOpenTicket, totalAssetCategory } = require('../Controllers/OrganizationMember/employeeDashboard');
const { bookingById, myBooking, createBooking } = require('../Controllers/OrganizationMember/bookingController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isEmployeePresent } = require('../Middlewares/isPresent');
const { uploadAttachment } = require("../Middlewares/uploadAttachment");

employee.post("/changePassword", verifyOrganizationMemberToken, isEmployeePresent, changePassword);
employee.get("/employee", verifyOrganizationMemberToken, isEmployeePresent, getMember);
employee.put("/update", verifyOrganizationMemberToken, isEmployeePresent, updateMember);

employee.post("/createTicket", verifyOrganizationMemberToken, isEmployeePresent, uploadAttachment.array("attachment", 10), createTicket);
employee.get("/myTickets", verifyOrganizationMemberToken, isEmployeePresent, myTicketForEmployee);
employee.get("/myTickets/:id", verifyOrganizationMemberToken, isEmployeePresent, getTicketById);
employee.put("/updateTicket/:id", verifyOrganizationMemberToken, isEmployeePresent, uploadAttachment.array("attachment", 10), updateTicketByEmployee);
employee.delete("/deleteAttachment/:id", verifyOrganizationMemberToken, isEmployeePresent, deleteAttachmentFile);
employee.get("/myAssets", verifyOrganizationMemberToken, isEmployeePresent, getMyAllAsset);

// Dashboard
employee.get("/myAssetNumber", verifyOrganizationMemberToken, isEmployeePresent, myAssetNumber);
employee.get("/myClosedTicket", verifyOrganizationMemberToken, isEmployeePresent, myClosedTicket);
employee.get("/myOpenTicket", verifyOrganizationMemberToken, isEmployeePresent, myOpenTicket);
employee.get("/totalAssetCategory", verifyOrganizationMemberToken, isEmployeePresent, totalAssetCategory);

// Booking
employee.post("/createBooking", verifyOrganizationMemberToken, isEmployeePresent, createBooking);
employee.get("/myBooking", verifyOrganizationMemberToken, isEmployeePresent, myBooking);
employee.get("/bookingById/:id", verifyOrganizationMemberToken, isEmployeePresent, bookingById);

module.exports = employee;