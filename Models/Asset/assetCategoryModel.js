module.exports = (sequelize, DataTypes) => {
    const AssetCategories = sequelize.define("assetCategories", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        categoryName: {
            type: DataTypes.STRING
        },
        categoryNumber: {
            type: DataTypes.STRING
        }
    })
    return AssetCategories;
}