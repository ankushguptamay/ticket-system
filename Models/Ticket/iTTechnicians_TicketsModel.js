module.exports = (sequelize, DataTypes) => {
    const ITTechnicians_Ticket = sequelize.define("iTTechnicians_Tickets", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        }
    })
    return ITTechnicians_Ticket;
}

// iTTechnicianId
// ticketId