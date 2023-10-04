const db = require('../../Models');
const Ticket = db.ticket;
const TicketAttachment = db.ticketAttachment;
const OrganizationMember = db.organizationMember;
const ITTechnicians_Ticket = db.iTTechnicians_Ticket;
const { createAttachment } = require("../../Middlewares/validate");
const { Op } = require('sequelize');

exports.createTicket = async (req, res) => {
    try {
        if (req.files.length < 1) {
            return res.status(400).send({
                success: false,
                message: "Please..Upload atleast one attachment!"
            });
        }
        // Validate Body
        const { error } = createAttachment(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Generating ticket number
        const date = JSON.stringify(new Date((new Date).getTime() - (24 * 60 * 60 * 1000)));
        const Day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const dayNumber = (new Date).getDay();
        const today = `${date.slice(1, 12)}18:30:00.000Z`;
        const { ticketCategory, subject, details } = req.body;
        let number;
        const tickets = await Ticket.findAll({
            where: {
                createdAt: { [Op.gt]: today }
            },
            order: [
                ['createdAt', 'ASC']
            ]
        });
        const day = new Date().toISOString().slice(8, 10);
        const year = new Date().toISOString().slice(2, 4);
        const month = new Date().toISOString().slice(5, 7);
        if (tickets.length == 0) {
            number = day + month + year + Day[dayNumber] + 1;
        } else {
            let lastTicket = tickets[tickets.length - 1];
            let lastDigits = lastTicket.ticketNumber.substring(9);
            let incrementedDigits = parseInt(lastDigits, 10) + 1;
            number = day + month + year + Day[dayNumber] + incrementedDigits;
        }
        // Create database
        const ticket = await Ticket.create({
            ticketNumber: number,
            ticketCategory: ticketCategory,
            subject: subject,
            details: details,
            createrId: req.organizationMember.id
        });
        // Create attachment
        for (let i = 0; i < req.files.length; i++) {
            await TicketAttachment.create({
                ticketId: ticket.id,
                attachment_FileName: req.files[i].filename,
                attachment_OriginalName: req.files[i].originalname,
                attachment_Path: req.files[i].path,
                attachment_MimeType: req.files[i].mimetype
            });
        }
        // find all IT technician
        const technician = await OrganizationMember.findAll({
            where: {
                post: "IT TECHNICIAN"
            },
            order: [
                ["createdAt", "ASC"]
            ]
        });
        // Assign to technician
        const totalTechnician = technician.length;
        if (totalTechnician === 0) {
            return res.status(200).send({
                success: true,
                message: `Ticket created But There are no technician available! Ticket Number ${number}`
            });
        } else if (totalTechnician === 1) {
            await ITTechnicians_Ticket.create({
                ticketId: ticket.id,
                iTTechnicianId: technician[0].id
            });
        } else {
            const date = JSON.stringify(new Date((new Date).getTime() - (24 * 60 * 60 * 1000)));
            const today = `${date.slice(1, 12)}18:30:00.000Z`;
            const todaysTotalTicket = await Ticket.count({
                where: {
                    createdAt: { [Op.gte]: today }
                }
            });
            const remain = parseInt(todaysTotalTicket) % parseInt(totalTechnician);
            if (remain === 0) {
                const lastTechnician = parseInt(totalTechnician) - 1;
                await ITTechnicians_Ticket.create({
                    ticketId: ticket.id,
                    iTTechnicianId: technician[lastTechnician].id
                });
            } else {
                await ITTechnicians_Ticket.create({
                    ticketId: ticket.id,
                    iTTechnicianId: technician[remain - 1].id
                });
            }

        }
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Ticket created successfully! Ticket Number ${number}`,
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.myTicketForEmployee = async (req, res) => {
    try {
        // Pagination
        const { page, recordLimit, search } = req.query;
        const limit = parseInt(recordLimit) || 5;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * limit;
            currentPage = parseInt(page);
        }
        const condition = [{ createrId: req.organizationMember.id }];
        // Include search
        if (search) {
            condition.push({
                [Op.or]: [
                    { ticketNumber: search },
                    { ticketCategory: search },
                    { subject: { [Op.substring]: search } },
                    { status: (search).toUpperCase() }
                ]
            })
        }
        // Count Tickets
        const totalTicket = await Ticket.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get Tickets
        const ticket = await Ticket.findAll({
            limit: limit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            include: [{
                model: TicketAttachment,
                as: "attachment"
            }],
            order: [
                ["status", "ASC"],
                ["createdAt", "DESC"]
            ]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Tickets fetched successfully!`,
            totalPage: Math.ceil(totalTicket / limit),
            currentPage: currentPage,
            data: ticket
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.myTicketForITTechnician = async (req, res) => {
    try {
        // Pagination
        const { page, recordLimit, search } = req.query;
        const limit = parseInt(recordLimit) || 5;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * limit;
            currentPage = parseInt(page);
        }
        // Get Ticket id assign to technician
        const condition = [];
        const associationTable = await ITTechnicians_Ticket.findAll({
            where: {
                iTTechnicianId: req.organizationMember.id
            }
        });
        const ticketIdArray = [];
        for (let i = 0; i < associationTable.length; i++) {
            ticketIdArray.push(associationTable[i].ticketId);
        }
        condition.push({ id: ticketIdArray });
        // Include search
        if (search) {
            condition.push({
                [Op.or]: [
                    { ticketNumber: search },
                    { ticketCategory: search },
                    { subject: { [Op.substring]: search } },
                    { status: (search).toUpperCase() }
                ]
            })
        }
        // Count Tickets
        const totalTicket = await Ticket.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get Tickets
        const ticket = await Ticket.findAll({
            limit: limit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            include: [{
                model: TicketAttachment,
                as: "attachment"
            }, {
                model: OrganizationMember,
                as: "employee",
                attributes: ["id", "name", "department"]
            }],
            order: [
                ["status", "ASC"],
                ["createdAt", "DESC"]
            ]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Tickets fetched successfully!`,
            totalPage: Math.ceil(totalTicket / limit),
            currentPage: currentPage,
            data: ticket
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.ticketForAdmin = async (req, res) => {
    try {
        // Pagination
        const { page, recordLimit, search } = req.query;
        const limit = parseInt(recordLimit) || 5;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * limit;
            currentPage = parseInt(page);
        }
        const condition = [];
        // Include search
        if (search) {
            condition.push({
                [Op.or]: [
                    { ticketNumber: search },
                    { ticketCategory: search },
                    { subject: { [Op.substring]: search } },
                    { status: (search).toUpperCase() }
                ]
            })
        }
        // Count Tickets
        const totalTicket = await Ticket.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get Tickets
        const ticket = await Ticket.findAll({
            limit: limit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            include: [{
                model: TicketAttachment,
                as: "attachment"
            }, {
                model: OrganizationMember,
                as: "employee",
                attributes: ["id", "name", "department"]
            }],
            order: [
                ["status", "ASC"],
                ["createdAt", "DESC"]
            ]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Tickets fetched successfully!`,
            totalPage: Math.ceil(totalTicket / limit),
            currentPage: currentPage,
            data: ticket
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.updateTicketByTechnician = async (req, res) => {
    try {
        const { status, subject, ticketCategory, reply } = req.query;
        const assign = await ITTechnicians_Ticket.findOne({
            ticketId: req.params.id,
            iTTechnicianId: req.organizationMember.id
        });
        if (!assign) {
            res.status(400).send({
                success: false,
                message: `Tickets is not assign to you!`
            });
        }
        const ticket = await Ticket.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!ticket) {
            res.status(400).send({
                success: false,
                message: `Tickets is not present!`
            });
        }
        await ticket.update({
            ...ticket,
            status: status,
            subject: subject,
            ticketCategory: ticketCategory,
            reply: reply
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Tickets updated successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};