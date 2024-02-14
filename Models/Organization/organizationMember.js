module.exports = (sequelize, DataTypes) => {
    const OrganizationMember = sequelize.define("organizationMembers", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        department: {
            type: DataTypes.STRING
        },
        post: {
            type: DataTypes.STRING,
            defaultValue: 'EMPLOYEE'
        },
        attendanceId: {
            type: DataTypes.STRING
        },
        qrImage: {
            type: DataTypes.TEXT("long")
        }
    }, {
        paranoid: true
    })
    return OrganizationMember;
}