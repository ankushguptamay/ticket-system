const db = require('../../Models');
const OrganizationMember = db.organizationMember;
const EmployeeAsset = db.employeeAsset;
const Asset = db.asset;
const { login, memberRegistration, changePassword, memberUpdationAdmin, memberUpdation } = require("../../Middlewares/validate");
const { JWT_SECRET_KEY, JWT_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const QRCode = require("qrcode");
const SALT = 10;

// register
// login
// changePassword
// getMember

exports.registerMember = async (req, res) => {
    try {
        // Validate Body
        const { error } = memberRegistration(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // If Email is already present
        const isMember = await OrganizationMember.findOne({
            where: {
                [Op.or]: [
                    { attendanceId: req.body.attendanceId }, { email: req.body.email }
                ]
            },
            paranoid: false
        });
        if (isMember) {
            return res.status(400).send({
                success: false,
                message: "This credentials is already present!"
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Create qrCode
        // const data = `${req.body.attendanceId}`;
        const string = JSON.stringify(req.body.attendanceId);
        const qrImage = await QRCode.toDataURL(string);
        // Create database
        const Post = (req.body.post).toUpperCase();
        await OrganizationMember.create({
            ...req.body,
            password: hashedPassword,
            post: Post,
            qrImage: qrImage
        });
        // Save qrCode
        // Send final success response
        res.status(200).send({
            success: true,
            message: `${req.body.post} Registered successfully!`,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        // Validate Body
        const { error } = changePassword(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        const member = await OrganizationMember.findOne({
            where: {
                email: req.organizationMember.email, id: req.organizationMember.id
            }
        });
        if (!member) {
            return res.status(400).send({
                success: false,
                message: "Invalid credentials!"
            });
        }
        // Compare current password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.currentPassword,
            member.password
        );
        if (!validPassword) {
            return res.status(400).send({
                success: false,
                message: "Invalid current password!"
            });
        }
        // Generate hash password of newPassword
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
        await member.update({
            ...member,
            password: hashedPassword
        });
        // Generate JWT Token
        const authToken = jwt.sign(
            {
                id: member.id,
                email: req.body.email,
                post: member.post
            },
            JWT_SECRET_KEY,
            { expiresIn: JWT_VALIDITY } // five day
        );
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Password changed successfully!',
            authToken: authToken,
            post: member.post
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.getMember = async (req, res) => {
    try {
        const member = await OrganizationMember.findOne({
            where: {
                [Op.and]: [
                    { id: req.organizationMember.id }, { email: req.organizationMember.email }, { post: req.organizationMember.post }
                ]
            },
            attributes: { exclude: ['password'] }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `${member.post} Profile Fetched successfully!`,
            data: member
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

// For Admin
exports.getAllMember = async (req, res) => {
    try {
        const { page, recordLimit, search } = req.query;
        // Pagination
        const limit = parseInt(recordLimit) || 5;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * limit;
            currentPage = parseInt(page);
        }
        const condition = [
            { post: { [Op.ne]: "ADMIN" } }
        ];
        // Include Search
        if (search) {
            condition.push({
                [Op.or]: [
                    { name: { [Op.substring]: search } },
                    { email: { [Op.substring]: search } },
                    { mobileNumber: { [Op.substring]: search } },
                    { post: (search).toUpperCase() },
                    { attendanceId: search }
                ]
            })
        }
        // Count Total Member
        const totalMember = await OrganizationMember.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get all member
        const member = await OrganizationMember.findAll({
            limit: limit,
            offset: offSet,
            order: [
                ["createdAt", "ASC"]
            ],
            where: {
                [Op.and]: condition
            },
            attributes: {
                exclude: ['password']
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Profile Fetched successfully!`,
            totalPage: Math.ceil(totalMember / limit),
            currentPage: currentPage,
            data: member
        });

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

// For Technician
exports.getAllEmployee = async (req, res) => {
    try {
        const { page, recordLimit, search } = req.query;
        // Pagination
        const limit = parseInt(recordLimit) || 5;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * limit;
            currentPage = parseInt(page);
        }
        const condition = [
            { post: "EMPLOYEE" }
        ];
        // Include Search
        if (search) {
            condition.push({
                [Op.or]: [
                    { name: { [Op.substring]: search } },
                    { attendanceId: search }
                ]
            })
        }
        // Count Total Member
        const totalEmployee = await OrganizationMember.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get all member
        const employee = await OrganizationMember.findAll({
            limit: limit,
            offset: offSet,
            order: [
                ["createdAt", "ASC"]
            ],
            where: {
                [Op.and]: condition
            },
            attributes: {
                exclude: ['password', 'email', 'mobileNumber']
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Employee Fetched successfully!`,
            totalPage: Math.ceil(totalEmployee / limit),
            currentPage: currentPage,
            data: employee
        });

    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.getMemberByQRCode = async (req, res) => {
    try {
        const attendanceId = req.body.attendanceId;
        const member = await OrganizationMember.findOne({
            where: {
                attendanceId: attendanceId
            },
            attributes: { exclude: ['password'] },
            include: [{
                model: EmployeeAsset,
                as: "emplyee_asset_association"
            }]
        });
        if (!member) {
            return res.status(400).send({
                success: false,
                message: "Employee is not present!"
            });
        }
        // Send final success response
        res.status(200).send({
            success: true,
            message: `${member.post} profile fetched successfully!`,
            data: member
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.updateEmployeeByAdmin = async (req, res) => {
    try {
        // Validate Body
        const { error } = memberUpdationAdmin(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const member = await OrganizationMember.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!member) {
            return res.status(400).send({
                success: false,
                message: "Employee is not present!"
            });
        }
        const { name, email, mobileNumber, post, department, attendanceId } = req.body;
        await member.update({
            ...member,
            name: name,
            email: email,
            mobileNumber: mobileNumber,
            attendanceId: attendanceId,
            post: post,
            department: department
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `${member.post} profile updated successfully!`,
            data: member
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.getMemberById = async (req, res) => {
    try {
        const member = await OrganizationMember.findOne({
            where: {
                id: req.params.id
            },
            attributes: { exclude: ['password'] }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `${member.post} Profile Fetched successfully!`,
            data: member
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.updateMember = async (req, res) => {
    try {
        // Validate Body
        const { error } = memberUpdation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Update
        const { name } = req.body;
        await OrganizationMember.update({
            name: name
        }, {
            where: {
                id: req.organizationMember.id
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Profile name updated successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}

exports.getMyAllAsset = async (req, res) => {
    try {
        const asset = await EmployeeAsset.findAll({
            where: {
                employeeId: req.organizationMember.id
            },
            include: [{
                model: Asset,
                as: "asset",
                attributes: {
                    exclude: ['quantity']
                }
            }],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset fetched successfully!`,
            data: asset
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};