module.exports = (sequelize, DataTypes) => {
    const ITAsset = sequelize.define("iTAssets", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING
        },
        mobileNumber: {
            type: DataTypes.STRING
        },
        countryCode: {
            type: DataTypes.STRING
        }
    })
    return ITAsset;
}