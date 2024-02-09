const db = require('../../Models');
const OrganizationMember = db.organizationMember;
const EmployeeAsset = db.employeeAsset;
const EmailCredential = db.emailCredential;
const Asset = db.asset;
const ForgetOTP = db.forgetOTP;
const { login, memberRegistration, changePassword, memberUpdationAdmin, memberUpdation, sendOTP, verifyOTP, generatePassword } = require("../../Middlewares/validate");
const { JWT_SECRET_KEY, JWT_VALIDITY, OTP_DIGITS_LENGTH, FORGET_OTP_VALIDITY } = process.env;
const emailOTP = require('../../Util/generateOTP');
const { sendEmail } = require("../../Util/sendEmail");
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

exports.sendOTPForForgetPassword = async (req, res) => {
    try {
        // Validate body
        const { error } = sendOTP(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { email } = req.body;
        const isMember = await OrganizationMember.findOne({
            where: {
                email: email
            }
        });
        if (!isMember) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! try to login with currect credentials.'
            });
        }
        // Generate OTP for Email
        const otp = emailOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
        // Update sendEmail 0 every day
        const date = JSON.stringify(new Date());
        const todayDate = `${date.slice(1, 11)}`;
        const changeUpdateDate = await EmailCredential.findAll({
            where: {
                updatedAt: { [Op.lt]: todayDate }
            },
            order: [
                ['createdAt', 'ASC']
            ]
        });
        for (let i = 0; i < changeUpdateDate.length; i++) {
            // console.log("hii");
            await EmailCredential.update({
                emailSend: 0
            }, {
                where: {
                    id: changeUpdateDate[i].id
                }
            });
        }
        // finalise email credentiel
        const emailCredential = await EmailCredential.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        });
        let finaliseEmailCredential;
        for (let i = 0; i < emailCredential.length; i++) {
            if (parseInt(emailCredential[i].emailSend) < 300) {
                finaliseEmailCredential = emailCredential[i];
                break;
            }
        }
        if (emailCredential.length <= 0) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! Some server error!'
            });
        }
        if (!finaliseEmailCredential) {
            return res.status(400).send({
                success: false,
                message: 'Sorry! Some server error!'
            });
        }
        // Send OTP to Email By Brevo
        if (finaliseEmailCredential.plateForm === "BREVO") {
            const options = {
                brevoEmail: finaliseEmailCredential.email,
                brevoKey: finaliseEmailCredential.EMAIL_API_KEY,
                headers: { "OTP for regenerate password": "123A" },
                htmlContent: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verification Card</title>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap">
                    <style>
                        body {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            font-family: 'Poppins', sans-serif;
                        }
                        .verification-card {
                            padding: 30px;
                            border: 1px solid #ccc;
                            box-shadow: 0 0 10px rgba(0, 0, 255, 0.1);
                            max-width: 400px;
                            width: 100%;
                            font-family: 'Poppins', sans-serif;
                        }
                        .logo-img {
                            max-width: 100px;
                            height: auto;
                        }
                        .horizontal-line {
                            border-top: 1px solid #ccc;
                            margin: 15px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="verification-card">
                        <img src="https://images.unsplash.com/photo-1636051028886-0059ad2383c8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Logo" class="logo-img">
                        <p style='font-size:14px'>Hi <span style=" font-weight:600">${email},</span></p>
                        <p style='font-size:14px;'>Please copy the One Time Password (OTP) below and enter it in the verification page on the Inventory App.</p>
                         <div class="horizontal-line"></div>
                        <p style="font-size: 32px; font-weight: bold; text-align:center; color:#1c2e4a  font-family: 'Poppins', serif;"> ${otp}</p>
                        <div class="horizontal-line"></div>
                        
                        <p style='font-size:14px;'>This code <span style="font-weight:600;" >expires in ${parseInt(FORGET_OTP_VALIDITY) / 1000 / 60} minutes.</span>Please,  <span style="font-weight:600;" >DONOT SHARE OR SEND THIS CODE TO ANYONE!</span></p>
                          <div class="horizontal-line"></div>
                    </div>
                </body>
                </html>`,
                userEmail: email,
                userName: isMember.name
            }
            const response = await sendEmail(options);
            // console.log(response);
            const increaseNumber = parseInt(finaliseEmailCredential.emailSend) + 1;
            await EmailCredential.update({
                emailSend: increaseNumber
            }, { where: { id: finaliseEmailCredential.id } });
        }
        //  Store OTP
        await ForgetOTP.create({
            vallidTill: new Date().getTime() + parseInt(FORGET_OTP_VALIDITY),
            otp: otp,
            userId: isMember.id
        });
        res.status(201).send({
            success: true,
            message: `OTP send to email successfully! Valid for ${FORGET_OTP_VALIDITY / (60 * 1000)} minutes!`,
            data: { email: email }
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        // Validate body
        const { error } = verifyOTP(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { email, otp } = req.body;
        // Is Email Otp exist
        const isOtp = await ForgetOTP.findOne({
            where: {
                otp: otp
            }
        });
        if (!isOtp) {
            return res.status(400).send({
                success: false,
                message: `Invalid OTP!`
            });
        }
        // Checking is user present or not
        const member = await OrganizationMember.findOne({
            where: {
                [Op.and]: [
                    { email: email }, { id: isOtp.userId }
                ]
            }
        });
        if (!member) {
            return res.status(400).send({
                success: false,
                message: "No Details Found. Register Now!"
            });
        }
        // is email otp expired?
        const isOtpExpired = new Date().getTime() > parseInt(isOtp.vallidTill);
        if (isOtpExpired) {
            await ForgetOTP.destroy({ where: { userId: isOtp.userId } });
            return res.status(400).send({
                success: false,
                message: `OTP expired!`
            });
        }
        await ForgetOTP.destroy({ where: { userId: isOtp.userId } });
        res.status(201).send({
            success: true,
            message: `OTP matched successfully!`,
            data: { email: email }
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};

exports.generatePassword = async (req, res) => {
    try {
        // Validate body
        const { error } = generatePassword(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "Password should be match!"
            });
        }
        // Checking is user present or not
        const member = await OrganizationMember.findOne({
            where: {
                email: email
            }
        });
        if (!member) {
            return res.status(400).send({
                success: false,
                message: "No Details Found. Register Now!"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const bcPassword = await bcrypt.hash(password, salt);
        // Update User
        await member.update({
            ...member,
            password: bcPassword
        });
        // Generate Authtoken
        const authToken = jwt.sign(
            {
                id: member.id,
                email: req.body.email
            },
            JWT_SECRET_KEY,
            { expiresIn: JWT_VALIDITY } // five day
        );
        res.status(201).send({
            success: true,
            message: `Password generated successfully!`,
            authToken: authToken,
            post: member.post
        });
    }
    catch (err) {
        res.status(500).send({
            success: false,
            err: err.message
        });
    }
};