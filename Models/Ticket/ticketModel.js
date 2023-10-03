module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define("tickets", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        ticketCategory: {
            type: DataTypes.STRING
        },
        subject: {
            type: DataTypes.STRING
        },
        details: {
            type: DataTypes.STRING(1234)
        },
        status: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['CREATED', 'IN PROCESS', 'CLOSED']]
            },
            defaultValue: 'CREATED'
        },
        reply: {
            type: DataTypes.STRING(1234)
        },
        ticketNumber: {
            type: DataTypes.STRING
        }
    })
    return Ticket;
}

// createrId