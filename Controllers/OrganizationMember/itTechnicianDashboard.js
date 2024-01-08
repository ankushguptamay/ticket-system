const db = require('../../Models');
const ITTechnicians_Ticket = db.iTTechnicians_Ticket;
const Ticket = db.ticket;
const { Op } = require('sequelize');

exports.myTicketNumber = async (req, res) => {
    try {
        const date = JSON.stringify(new Date());
        const todayDate = `${date.slice(1, 11)}`;
        const myTicket = await ITTechnicians_Ticket.count({
            where: {
                iTTechnicianId: req.organizationMember.id,
                createdAt: { [Op.gte]: todayDate }
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${myTicket} todays tickets!`,
            data: myTicket
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
        const myTicket = await ITTechnicians_Ticket.findAll({
            where: {
                iTTechnicianId: req.organizationMember.id
            }
        });
        const ticketId = [];
        for (let i = 0; i < myTicket.length; i++) {
            ticketId.push(myTicket[i].ticketId);
        }
        const openTicket = await Ticket.count({
            where: {
                id: ticketId,
                status: "ONGOING",
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${openTicket} open/ongoing tickets!`,
            data: openTicket
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
        const myTicket = await ITTechnicians_Ticket.findAll({
            where: {
                iTTechnicianId: req.organizationMember.id
            }
        });
        const ticketId = [];
        for (let i = 0; i < myTicket.length; i++) {
            ticketId.push(myTicket[i].ticketId);
        }
        const closedTicket = await Ticket.count({
            where: {
                id: ticketId,
                status: "RESOLVED"
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `you have ${closedTicket} closed/resolved tickets!`,
            data: closedTicket
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};