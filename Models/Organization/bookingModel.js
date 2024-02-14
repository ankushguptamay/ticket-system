module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("booking", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        startTime: {
            type: DataTypes.DATE,
            validate: {
                isDate: true
            }
        },
        endTime: {
            type: DataTypes.DATE,
            validate: {
                isDate: true
            }
        },
        venue: {
            type: DataTypes.STRING
        },
        bookingFor: {
            type: DataTypes.STRING
        },
        bookedBy_name: {
            type: DataTypes.STRING
        },
        bookedBy_id: {
            type: DataTypes.STRING
        },
        adminApproval: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['Approve', 'Decline']]
            }
        },
        bookingStatus: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['Open', 'Close']]
            },
            defaultValue: "Open"
        },
        lastUpdatedBy_name: {
            type: DataTypes.STRING
        },
        maintenanceId: {
            type: DataTypes.STRING
        }
    })
    return Booking;
}