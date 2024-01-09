const express = require("express");
const admin = express.Router();

const { register, getAdmin, changePassword } = require('../Controllers/Admin/adminController');
const { registerMember, getAllMember, getMemberByQRCode, updateEmployeeByAdmin, getMemberById } = require('../Controllers/OrganizationMember/organizationMemberController');
const { ticketForAdmin, getTicketById, updateTicketByAdmin } = require('../Controllers/Ticket/ticketController');
const { createAssetCategory, getAssetCategory, deleteAssetCategory, updateAssetCategory } = require('../Controllers/Asset/assetcategoryController');
const { getAllAsset, getAllAssetAssignTOEmployee, getAssetById, updateAsset } = require('../Controllers/Asset/assetController');
const { totalAsset, totalCategory, totalEmployee, totalMember } = require('../Controllers/Admin/adminDashboard');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isAdminPresent } = require('../Middlewares/isPresent');

admin.post("/register", register);
admin.post("/changePassword", verifyOrganizationMemberToken, isAdminPresent, changePassword);
admin.get("/admin", verifyOrganizationMemberToken, isAdminPresent, getAdmin);

// Organization Member
admin.post("/registerMember", verifyOrganizationMemberToken, isAdminPresent, registerMember);
admin.get("/employees", verifyOrganizationMemberToken, isAdminPresent, getAllMember);
admin.get("/employees/:id", verifyOrganizationMemberToken, isAdminPresent, getMemberById);
admin.get("/memberByQRCode", verifyOrganizationMemberToken, isAdminPresent, getMemberByQRCode);
admin.put("/updateEmployee/:id", verifyOrganizationMemberToken, isAdminPresent, updateEmployeeByAdmin);

// Ticket
admin.get("/tickets", verifyOrganizationMemberToken, isAdminPresent, ticketForAdmin);
admin.get("/tickets/:id", verifyOrganizationMemberToken, isAdminPresent, getTicketById);
admin.put("/updateTicket/:id", verifyOrganizationMemberToken, isAdminPresent, updateTicketByAdmin);

// Asset Category
admin.post("/createAssetCategory", verifyOrganizationMemberToken, isAdminPresent, createAssetCategory);
admin.get("/assetCategories", verifyOrganizationMemberToken, isAdminPresent, getAssetCategory);
admin.delete("/deleteAssetCategory/:id", verifyOrganizationMemberToken, isAdminPresent, deleteAssetCategory);
admin.put("/updateAssetCategory/:id", verifyOrganizationMemberToken, isAdminPresent, updateAssetCategory);

// Asset
admin.get("/assets", verifyOrganizationMemberToken, isAdminPresent, getAllAsset);
admin.get("/assets/:id", verifyOrganizationMemberToken, isAdminPresent, getAssetById);
admin.get("/assetToEmployee/:id", verifyOrganizationMemberToken, isAdminPresent, getAllAssetAssignTOEmployee);
admin.put("/updateAsset/:id", verifyOrganizationMemberToken, isAdminPresent, updateAsset);

// Dashboard
admin.get("/totalAsset", verifyOrganizationMemberToken, isAdminPresent, totalAsset);
admin.get("/totalCategory", verifyOrganizationMemberToken, isAdminPresent, totalCategory);
admin.get("/totalEmployee", verifyOrganizationMemberToken, isAdminPresent, totalEmployee);
admin.get("/totalMember", verifyOrganizationMemberToken, isAdminPresent, totalMember);

module.exports = admin;