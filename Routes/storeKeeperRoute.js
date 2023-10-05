const express = require("express");
const storeKeeper = express.Router();

const { getMember, changePassword } = require('../Controllers/OrganizationMember/organizationMemberController');
const { createAssetByStoreKeeper, getAllAsset, updateAsset } = require('../Controllers/Asset/assetController');
const { getAssetCategory, createAssetCategory } = require('../Controllers/Asset/assetcategoryController');

//middleware
const { verifyOrganizationMemberToken } = require('../Middlewares/verifyJWT');
const { isStoreKeeperPresent } = require('../Middlewares/isPresent');

storeKeeper.post("/changePassword", verifyOrganizationMemberToken, isStoreKeeperPresent, changePassword);
storeKeeper.get("/storeKeeper", verifyOrganizationMemberToken, isStoreKeeperPresent, getMember);

// Asset
storeKeeper.post("/createAsset", verifyOrganizationMemberToken, isStoreKeeperPresent, createAssetByStoreKeeper);
storeKeeper.get("/assets", verifyOrganizationMemberToken, isStoreKeeperPresent, getAllAsset);
storeKeeper.put("/updateAsset/:id", verifyOrganizationMemberToken, isStoreKeeperPresent, updateAsset);

// Asset Category
storeKeeper.post("/createAssetCategory", verifyOrganizationMemberToken, isStoreKeeperPresent, createAssetCategory);
storeKeeper.get("/assetCategories", verifyOrganizationMemberToken, isStoreKeeperPresent, getAssetCategory);

module.exports = storeKeeper;