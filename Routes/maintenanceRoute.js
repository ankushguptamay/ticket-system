const express = require("express");
const maintenance = express.Router();

const { getMember, changePassword, getAllEmployee, updateMember } = require('../Controllers/OrganizationMember/organizationMemberController');
const { myTicketForResolver, updateTicketByResolver, getTicketById } = require('../Controllers/Ticket/ticketController');
const { myClosedTicket, myOpenTicket, myTicketNumber } = require('../Controllers/OrganizationMember/itTechnicianDashboard');
const { bookingById, myBookingForMaintenance, updateBooking } = require('../Controllers/OrganizationMember/bookingController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isMaintenancePresent } = require('../Middlewares/isPresent');

maintenance.post("/changePassword", verifyOrganizationMemberToken, isMaintenancePresent, changePassword);
maintenance.get("/maintenance", verifyOrganizationMemberToken, isMaintenancePresent, getMember);
maintenance.put("/update", verifyOrganizationMemberToken, isMaintenancePresent, updateMember);

// Employee
maintenance.get("/employees", verifyOrganizationMemberToken, isMaintenancePresent, getAllEmployee);

// Ticket
maintenance.get("/myTickets", verifyOrganizationMemberToken, isMaintenancePresent, myTicketForResolver);
maintenance.get("/myTickets/:id", verifyOrganizationMemberToken, isMaintenancePresent, getTicketById);
maintenance.put("/updateTicket/:id", verifyOrganizationMemberToken, isMaintenancePresent, updateTicketByResolver);

// Dashboard
maintenance.get("/myTicketNumber", verifyOrganizationMemberToken, isMaintenancePresent, myTicketNumber);
maintenance.get("/openTicket", verifyOrganizationMemberToken, isMaintenancePresent, myOpenTicket);
maintenance.get("/closedTicket", verifyOrganizationMemberToken, isMaintenancePresent, myClosedTicket);

// Booking
maintenance.put("/updateBooking/:id", verifyOrganizationMemberToken, isMaintenancePresent, updateBooking);
maintenance.get("/myBooking", verifyOrganizationMemberToken, isMaintenancePresent, myBookingForMaintenance);
maintenance.get("/bookingById/:id", verifyOrganizationMemberToken, isMaintenancePresent, bookingById);

module.exports = maintenance;