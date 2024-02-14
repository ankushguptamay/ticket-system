const db = require('../../Models');
const Booking = db.booking;
const OrganizationMember = db.organizationMember;
const { Op } = require("sequelize");
const { createBooking, approveOrDecline, updateBooking } = require("../../Middlewares/validate");

exports.createBooking = async (req, res) => {
    try {
        // Validate Body
        const { error } = createBooking(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Find creator name
        const member = await OrganizationMember.findOne({
            where: {
                id: req.organizationMember.id, email: req.organizationMember.email
            }
        });
        const { startTime, endTime, venue, bookingFor } = req.body;
        // cteate booking
        await Booking.create({
            startTime: startTime,
            endTime: endTime,
            venue: venue,
            bookingFor: bookingFor,
            bookedBy_id: req.organizationMember.id,
            bookedBy_name: member.name
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Booked successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.myBooking = async (req, res) => {
    try {
        const booking = await Booking.findAll({
            where: {
                bookedBy_id: req.organizationMember.id
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Your booking fetched successfully!`,
            data: booking
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.allBooking = async (req, res) => {
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
        const condition = [];
        // Include Search
        if (search) {
            condition.push({
                [Op.or]: [
                    { venue: { [Op.substring]: search } },
                    { bookingFor: { [Op.substring]: search } },
                    { bookedBy_name: { [Op.substring]: search } },
                    { adminApproval: { [Op.substring]: search } },
                    { lastUpdatedBy_name: { [Op.substring]: search } }
                ]
            })
        }
        // Count Total Booking
        const totalBooking = await Booking.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get all Booking
        const booking = await Booking.findAll({
            limit: limit,
            offset: offSet,
            order: [
                ["createdAt", "DESC"]
            ],
            where: {
                [Op.and]: condition
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Booking fetched successfully!`,
            totalPage: Math.ceil(totalBooking / limit),
            currentPage: currentPage,
            data: booking
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.approveOrDecline = async (req, res) => {
    try {
        // Validate Body
        const { error } = approveOrDecline(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const date = JSON.stringify(new Date((new Date).getTime() - (24 * 60 * 60 * 1000)));
        const today = `${date.slice(1, 12)}18:30:00.000Z`;
        const adminApproval = req.body.adminApproval;
        // Find Booking
        const booking = await Booking.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!booking) {
            return res.status(400).send({
                success: true,
                message: `This booking is not present!`
            });
        }
        // Find updator name
        const member = await OrganizationMember.findOne({
            where: {
                id: req.organizationMember.id, email: req.organizationMember.email
            }
        });
        if (adminApproval === "Approve") {
            const resolver = await OrganizationMember.findAll({
                where: {
                    post: "MAINTENANCE"
                },
                order: [
                    ["createdAt", "ASC"]
                ]
            });
            // Assign to resolver
            const totalResolver = resolver.length;
            if (totalResolver === 0) {
                return res.status(200).send({
                    success: true,
                    message: `Booking approved But Maintenance is not available!`
                });
            } else if (totalResolver === 1) {
                await booking.update({
                    adminApproval: adminApproval,
                    lastUpdatedBy_name: member.name,
                    maintenanceId: resolver[0].id
                });
            } else {
                const todaysTotalTicket = await Booking.count({
                    where: {
                        createdAt: { [Op.gte]: today }
                    }
                });
                const remain = parseInt(todaysTotalTicket) % parseInt(totalResolver);
                if (remain === 0) {
                    const lastResolver = parseInt(totalResolver) - 1;
                    await booking.update({
                        adminApproval: adminApproval,
                        lastUpdatedBy_name: member.name,
                        maintenanceId: resolver[lastResolver].id
                    });
                } else {
                    await booking.update({
                        adminApproval: adminApproval,
                        lastUpdatedBy_name: member.name,
                        maintenanceId: resolver[remain - 1].id
                    });
                }
            }
        } else {
            // Update Booking
            await booking.update({
                adminApproval: adminApproval,
                lastUpdatedBy_name: member.name
            });
        }
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Booking ${adminApproval} successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.bookingById = async (req, res) => {
    try {
        // Find Booking
        const booking = await Booking.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!booking) {
            return res.status(400).send({
                success: true,
                message: `This booking is not present!`
            });
        }
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Booking fetched successfully!`,
            data: booking
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.myBookingForMaintenance = async (req, res) => {
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
            { maintenanceId: req.organizationMember.id },
            { adminApproval: "Approve" }
        ];
        // Include Search
        if (search) {
            condition.push({
                [Op.or]: [
                    { venue: { [Op.substring]: search } },
                    { bookingFor: { [Op.substring]: search } },
                    { bookedBy_name: { [Op.substring]: search } },
                    { adminApproval: { [Op.substring]: search } },
                    { lastUpdatedBy_name: { [Op.substring]: search } }
                ]
            })
        }
        // Count Total Booking
        const totalBooking = await Booking.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get all Booking
        const booking = await Booking.findAll({
            limit: limit,
            offset: offSet,
            order: [
                ["createdAt", "DESC"]
            ],
            where: {
                [Op.and]: condition
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Booking fetched successfully!`,
            totalPage: Math.ceil(totalBooking / limit),
            currentPage: currentPage,
            data: booking
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        // Validate Body
        const { error } = updateBooking(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { bookingStatus } = req.body;
        let condition = {
            id: req.params.id
        };
        if (req.organizationMember.post === "MAINTENANCE") {
            condition = {
                id: req.params.id,
                maintenanceId: req.organizationMember.id,
                adminApproval: "Approve"
            };
        }
        // Find Booking
        const booking = await Booking.findOne({
            where: condition
        });
        if (!booking) {
            return res.status(400).send({
                success: true,
                message: `This booking is not present!`
            });
        }
        // Find updator name
        const member = await OrganizationMember.findOne({
            where: {
                id: req.organizationMember.id, email: req.organizationMember.email
            }
        });
        // Update Booking
        await booking.update({
            ...booking,
            bookingStatus: bookingStatus,
            lastUpdatedBy_name: member.name
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Booking updated successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};