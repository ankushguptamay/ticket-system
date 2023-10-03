module.exports = (sequelize, DataTypes) => {
    const TicketAttachment = sequelize.define("ticketAttachments", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        attachment_FileName: {
            type: DataTypes.STRING(1234)
        },
        attachment_OriginalName: {
            type: DataTypes.STRING
        },
        attachment_Path: {
            type: DataTypes.STRING(1234)
        },
        attachment_MimeType: {
            type: DataTypes.STRING
        }
    })
    return TicketAttachment;
}

// ticketId