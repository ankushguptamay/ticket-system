require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const admin = require('./Routes/adminRoute');
const employee = require('./Routes/employeeRoute');
const technician = require('./Routes/iTTechnicianRoute');
const keeper = require('./Routes/storeKeeperRoute');
const common = require('./Routes/commonRoute');

const app = express();

var corsOptions = {
  origin: "*",
};

const db = require('./Models');
db.sequelize.sync()
  .then(() => {
    // console.log('Database is synced');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/admin", admin);
app.use("/api/employee", employee);
app.use("/api/iTTechnician", technician);
app.use("/api/storeKeeper", keeper);
app.use("/common", common);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});