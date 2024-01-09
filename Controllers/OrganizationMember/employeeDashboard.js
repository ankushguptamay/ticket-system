const db = require('../../Models');
const OrganizationMember = db.organizationMember;
const EmployeeAsset = db.employeeAsset;
const Asset = db.asset;
const Ticket = db.ticket;

exports.myAssetNumber = async (req, res) => {
    try {
        const asset = await EmployeeAsset.count({
            where: {
                employeeId: req.organizationMember.id
            }
        });
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

exports.myOpenTicket = async (req, res) => {
    try {
        const ticket = await Ticket.count({
            where: {
                status: "ONGOING",
                createrId: req.organizationMember.id
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${ticket} open/ongoing ticket!`,
            data: ticket
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.myClosedTicket = async (req, res) => {
    try {
        const ticket = await Ticket.count({
            where: {
                status: "RESOLVED",
                createrId: req.organizationMember.id
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${ticket} closed/resolved ticket!`,
            data: ticket
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.totalAssetCategory = async (req, res) => {
    try {
        const employeeAsset = await EmployeeAsset.findAll({
            where: {
                employeeId: req.organizationMember.id
            }
        });
        const assetId = [];
        for (let i = 0; i < employeeAsset.length; i++) {
            assetId.push(employeeAsset[i].assetId);
        }
        const assets = await Asset.findAll({ where: { id: assetId } });
        const categoryName = [];
        for (let i = 0; i < assets.length; i++) {
            categoryName.push(assets[i].assetCategory);
        }
        function onlyUnique(value, index, array) {
            return array.indexOf(value) === index;
        }
        var unique = categoryName.filter(onlyUnique);
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${unique.length} asset category!`,
            data: unique.length
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};