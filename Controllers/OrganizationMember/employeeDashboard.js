const db = require('../../Models');
const OrganizationMember = db.organizationMember;
const EmployeeAsset = db.employeeAsset;
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