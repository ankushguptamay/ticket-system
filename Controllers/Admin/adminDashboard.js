const db = require('../../Models');
const OrganizationMember = db.organizationMember;
const EmployeeAsset = db.employeeAsset;
const Ticket = db.ticket;
const Asset = db.asset;
const AssetCategory = db.assetCategory;

exports.totalAsset = async (req, res) => {
    try {
        const asset = await Asset.count();
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${asset} asset!`,
            data: asset
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.totalCategory = async (req, res) => {
    try {
        const assetCategory = await AssetCategory.count();
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${assetCategory} asset category!`,
            data: assetCategory
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.totalEmployee = async (req, res) => {
    try {
        const employee = await OrganizationMember.count({
            where: {
                post: "EMPLOYEE"
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${member} employee!`,
            data: employee
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.totalMember = async (req, res) => {
    try {
        const member = await OrganizationMember.count();
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${member} member!`,
            data: member
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};