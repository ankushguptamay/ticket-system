module.exports = (sequelize, DataTypes) => {
    const ITAsset = sequelize.define("iTAssets", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        itemName: {
            type: DataTypes.STRING
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        assetNumber: {
            type: DataTypes.STRING
        },
        assetCategory: {
            type: DataTypes.STRING
        },
        itemSerialNumber: {
            type: DataTypes.STRING
        }
    })
    return ITAsset;
}