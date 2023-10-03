const db = require('../../Models');
const OrganizationMember = db.organizationMember;
const { login, memberRegistration, changePassword } = require("../../Middlewares/validate");
const { JWT_SECRET_KEY, JWT_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
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
                email: req.body.email,
            }
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
        // Create database
        const Post = toUppercase(req.body.post);
        await OrganizationMember.create({
            ...req.body,
            password: hashedPassword,
            post: Post
        });
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

exports.login = async (req, res) => {
    try {
        // Validate Body
        const { error } = login(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        // If Email is already present
        const member = await OrganizationMember.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!member) {
            return res.status(400).send({
                success: false,
                message: "Invalid credentials!"
            });
        }
        // Compare password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.password,
            member.password
        );
        if (!validPassword) {
            return res.status(400).send({
                success: false,
                message: "Invalid credentials!"
            });
        }
        // generate JWT Token
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
            message: 'Loged in successfully!',
            authToken: authToken,
            post: member.post
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
            message: `${toLowerCase(member.post)} Profile Fetched successfully!`,
            data: member
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
}