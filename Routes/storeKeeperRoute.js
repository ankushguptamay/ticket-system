const express = require("express");
const storeKeeper = express.Router();

const { getMember, changePassword, updateMember } = require('../Controllers/OrganizationMember/organizationMemberController');
const { createAssetByStoreKeeper, getAllAsset, updateAsset, getAssetById, getAssetByAssetCategory } = require('../Controllers/Asset/assetController');
const { getAssetCategory, createAssetCategory, updateAssetCategory } = require('../Controllers/Asset/assetcategoryController');
const { totalAsset, totalCategory, totalMember } = require('../Controllers/Admin/adminDashboard');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isStoreKeeperPresent } = require('../Middlewares/isPresent');

storeKeeper.post("/changePassword", verifyOrganizationMemberToken, isStoreKeeperPresent, changePassword);
storeKeeper.get("/storeKeeper", verifyOrganizationMemberToken, isStoreKeeperPresent, getMember);
storeKeeper.put("/update", verifyOrganizationMemberToken, isStoreKeeperPresent, updateMember);

// Asset
storeKeeper.post("/createAsset", verifyOrganizationMemberToken, isStoreKeeperPresent, createAssetByStoreKeeper);
storeKeeper.get("/assets", verifyOrganizationMemberToken, isStoreKeeperPresent, getAllAsset);
storeKeeper.get("/assets/:id", verifyOrganizationMemberToken, isStoreKeeperPresent, getAssetById);
storeKeeper.get("/assetsByCategories", verifyOrganizationMemberToken, isStoreKeeperPresent, getAssetByAssetCategory);
storeKeeper.put("/updateAsset/:id", verifyOrganizationMemberToken, isStoreKeeperPresent, updateAsset);

// Asset Category
storeKeeper.post("/createAssetCategory", verifyOrganizationMemberToken, isStoreKeeperPresent, createAssetCategory);
storeKeeper.get("/assetCategories", verifyOrganizationMemberToken, isStoreKeeperPresent, getAssetCategory);
storeKeeper.put("/updateAssetCategory/:id", verifyOrganizationMemberToken, isStoreKeeperPresent, updateAssetCategory);

// Dashboard
storeKeeper.get("/totalAsset", verifyOrganizationMemberToken, isStoreKeeperPresent, totalAsset);
storeKeeper.get("/totalCategory", verifyOrganizationMemberToken, isStoreKeeperPresent, totalCategory);
storeKeeper.get("/totalMember", verifyOrganizationMemberToken, isStoreKeeperPresent, totalMember);

module.exports = storeKeeper;