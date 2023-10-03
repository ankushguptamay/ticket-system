const dbConfig = require('../Config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.organizationMember = require('./Organization/organizationMember.js')(sequelize, Sequelize);
db.ticket = require('./Ticket/ticketModel.js')(sequelize, Sequelize);
db.ticketAttachment = require('./Ticket/ticketAttachmentModel.js')(sequelize, Sequelize);
db.asset = require('./Asset/iTAssetModel.js')(sequelize, Sequelize);
db.iTTechnicians_Ticket = require('./Ticket/iTTechnicians_TicketsModel.js')(sequelize, Sequelize);

db.ticket.hasMany(db.ticketAttachment, { foreignKey: 'ticketId', as: 'attachment' });

db.organizationMember.hasMany(db.ticket, { foreignKey: 'createrId', as: 'ticket' });
db.ticket.belongsTo(db.organizationMember, { foreignKey: 'createrId', as: 'employee' });

db.organizationMember.hasMany(db.iTTechnicians_Ticket, { foreignKey: 'iTTechnicianId', as: 'technician_ticket_association' });
db.iTTechnicians_Ticket.belongsTo(db.organizationMember, { foreignKey: 'iTTechnicianId', as: 'technician' });

db.ticket.hasMany(db.iTTechnicians_Ticket, { foreignKey: 'ticketId', as: 'technician_ticket_association' });
db.iTTechnicians_Ticket.belongsTo(db.ticket, { foreignKey: 'ticketId', as: 'ticket' });


module.exports = db;