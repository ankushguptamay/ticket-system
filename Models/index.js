const dbConfig = require('../Config/db.config.js');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectModule: require('mysql2'),
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

const queryInterface = sequelize.getQueryInterface();

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.organizationMember = require('./Organization/organizationMember.js')(sequelize, Sequelize);
db.ticket = require('./Ticket/ticketModel.js')(sequelize, Sequelize);
db.ticketAttachment = require('./Ticket/ticketAttachmentModel.js')(sequelize, Sequelize);
db.asset = require('./Asset/iTAssetModel.js')(sequelize, Sequelize);
db.iTTechnicians_Ticket = require('./Ticket/iTTechnicians_TicketsModel.js')(sequelize, Sequelize);
db.employeeAsset = require('./Organization/emplyeeAsignAssetModel.js')(sequelize, Sequelize);
db.assetCategory = require('./Asset/assetCategoryModel.js')(sequelize, Sequelize);

// Association bt ticket and ticket attachment
db.ticket.hasMany(db.ticketAttachment, { foreignKey: 'ticketId', as: 'attachment' });

// Association bt employee and ticket
db.organizationMember.hasMany(db.ticket, { foreignKey: 'createrId', as: 'ticket' });
db.ticket.belongsTo(db.organizationMember, { foreignKey: 'createrId', as: 'employee' });

// Association bt technician and juction table iTTechnicians_Ticket
db.organizationMember.hasMany(db.iTTechnicians_Ticket, { foreignKey: 'iTTechnicianId', as: 'technician_ticket_association' });
db.iTTechnicians_Ticket.belongsTo(db.organizationMember, { foreignKey: 'iTTechnicianId', as: 'technician' });

// Association bt ticket and junction table iTTechnicians_Ticket
db.ticket.hasMany(db.iTTechnicians_Ticket, { foreignKey: 'ticketId', as: 'technician_ticket_association' });
db.iTTechnicians_Ticket.belongsTo(db.ticket, { foreignKey: 'ticketId', as: 'ticket' });

// Association bt asset and junction table employeeAsset
db.asset.hasMany(db.employeeAsset, { foreignKey: 'assetId', as: 'emplyee_asset_association' });
db.employeeAsset.belongsTo(db.asset, { foreignKey: 'assetId', as: 'asset' });

// Association bt employee and junction table employeeAsset
db.organizationMember.hasMany(db.employeeAsset, { foreignKey: 'employeeId', as: 'emplyee_asset_association' });
db.employeeAsset.belongsTo(db.organizationMember, { foreignKey: 'employeeId', as: 'employee' });

// queryInterface.addColumn("iTAssets", "itemSerialNumber", { type: DataTypes.STRING }).then((res) => { console.log(res) }).catch((err) => { console.log(err) });

module.exports = db;