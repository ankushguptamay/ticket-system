module.exports = (sequelize, DataTypes) => {
    const EmployeeAsset = sequelize.define("employeeAssets", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATEONLY,
            validate: {
                isDate: true
            }
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        itemName: {
            type: DataTypes.STRING
        },
        assetNumber: {
            type: DataTypes.STRING
        },
        status:{
            type:DataTypes.STRING,
            validate: {
                isIn: [['WORKING', 'NON WORKING']]
            }
        }
    })
    return EmployeeAsset;
}