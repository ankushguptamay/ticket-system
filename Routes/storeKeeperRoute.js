const express = require("express");
const storeKeeper = express.Router();

const { getMember, changePassword } = require('../Controllers/OrganizationMember/organizationMemberController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isStoreKeeperPresent } = require('../Middlewares/isPresent');

storeKeeper.post("/changePassword", verifyOrganizationMemberToken, isStoreKeeperPresent, changePassword);
storeKeeper.get("/storeKeeper", verifyOrganizationMemberToken, isStoreKeeperPresent, getMember);

module.exports = storeKeeper;