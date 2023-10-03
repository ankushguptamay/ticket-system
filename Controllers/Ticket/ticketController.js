const db = require('../../Models');
const Ticket = db.ticket;
const TicketAttachment = db.ticketAttachment;
const OrganizationMember = db.organizationMember;
const ITTechnicians_Ticket = db.iTTechnicians_Ticket;
const { createAttachment } = require("../../Middlewares/validate");

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
        const { ticketCategory, subject, details } = req.body;
        let number;
        const tickets = await Ticket.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        });
        const day = new Date().toISOString().slice(8, 10);
        const year = new Date().toISOString().slice(2, 4);
        const month = new Date().toISOString().slice(5, 7);
        if (tickets.length == 0) {
            number = day + month + year + 1000;
        } else {
            let lastTicket = tickets[tickets.length - 1];
            let lastDigits = lastTicket.ticketNumber.substring(6);
            let incrementedDigits = parseInt(lastDigits, 10) + 1;
            number = day + month + year + incrementedDigits;
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
            }
        });
        // Assign to technician
        const numberOfTechnician = technician.length;
        if (numberOfTechnician === 1) {
            await ITTechnicians_Ticket.create({
                ticketId: ticket.id,
                iTTechnicianId: technician[0].id
            });
        }else{
            const date = JSON.stringify(new Date((new Date).getTime() - (24 * 60 * 60 * 1000)));
            const today = `${date.slice(1, 12)}18:30:00.000Z`;

        }
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Ticket created successfully!`,
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
        const ticket = await Ticket.findAll({
            where: {
                createrId: req.organizationMember.id
            },
            include: [{
                model: TicketAttachment,
                as: "attachment"
            }],
            order: [
                ["createdAt", "DESC"]
            ]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Tickets fetched successfully!`,
            data: ticket
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};