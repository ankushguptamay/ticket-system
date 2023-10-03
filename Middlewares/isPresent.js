const db = require('../Models');
const OrganizationMember = db.organizationMember;
const { Op } = require("sequelize")

exports.isAdminPresent = async (req, res, next) => {
    try {
        const organizationMember = await OrganizationMember.findOne({
            where: {
                [Op.and]: [
                    { id: req.organizationMember.id }, { email: req.organizationMember.email }, { post: "ADMIN" }
                ]
            }
        });
        if (!organizationMember) {
            return res.status(400).json({
                success: false,
                message: "Admin is not present!"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.isEmployeePresent = async (req, res, next) => {
    try {
        const organizationMember = await OrganizationMember.findOne({
            where: {
                [Op.and]: [
                    { id: req.organizationMember.id }, { email: req.organizationMember.email }, { post: "EMPLOYEE" }
                ]
            }
        });
        if (!organizationMember) {
            return res.status(400).json({
                success: false,
                message: "Employee is not present!"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.isITTechnicianPresent = async (req, res, next) => {
    try {
        const organizationMember = await OrganizationMember.findOne({
            where: {
                [Op.and]: [
                    { id: req.organizationMember.id }, { email: req.organizationMember.email }, { post: "IT TECHNICIAN" }
                ]
            }
        });
        if (!organizationMember) {
            return res.status(400).json({
                success: false,
                message: "IT technician is not present!"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

exports.isStoreKeeperPresent = async (req, res, next) => {
    try {
        const organizationMember = await OrganizationMember.findOne({
            where: {
                [Op.and]: [
                    { id: req.organizationMember.id }, { email: req.organizationMember.email }, { post: "STORE KEEPER" }
                ]
            }
        });
        if (!organizationMember) {
            return res.status(400).json({
                success: false,
                message: "Store keeper is not present!"
            })
        }
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}