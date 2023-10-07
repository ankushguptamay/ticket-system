const db = require('../../Models');
const Asset = db.asset;
const EmployeeAsset = db.employeeAsset;
const OrganizationMember = db.organizationMember;
const { createAsset, assignAsset } = require("../../Middlewares/validate");
const { Op } = require('sequelize');
const employee = require('../../Routes/employeeRoute');

exports.createAssetByStoreKeeper = async (req, res) => {
    try {
        // Validate Body
        const { error } = createAsset(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { itemName, assetCategory, quantity } = req.body;
        // check name duplicacy
        const isDuplicate = await Asset.findOne({
            where: {
                itemName: itemName
            }
        });
        if (isDuplicate) {
            return res.status(400).send({
                success: false,
                message: `This asset is already present! Asset number ${isDuplicate.assetNumber}`
            });
        }
        // Generating asset number
        let number;
        const asset = await Asset.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        });
        const day = new Date().toISOString().slice(8, 10);
        const year = new Date().toISOString().slice(2, 4);
        const month = new Date().toISOString().slice(5, 7);
        if (asset.length == 0) {
            number = day + month + year + 'ASSET' + 1000;
        } else {
            let lastAsset = asset[asset.length - 1];
            let lastDigits = lastAsset.assetNumber.substring(11);
            let incrementedDigits = parseInt(lastDigits, 10) + 1;
            number = day + month + year + 'ASSET' + incrementedDigits;
        }
        await Asset.create({
            itemName: itemName,
            assetCategory: assetCategory,
            quantity: quantity,
            assetNumber: number
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset created successfully! Asset Number ${number}`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

// for store keeper and admin
exports.getAllAsset = async (req, res) => {
    try {
        // Pagination
        const { page, recordLimit, search } = req.query;
        const limit = parseInt(recordLimit) || 5;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * limit;
            currentPage = parseInt(page);
        }
        const condition = [];
        // Include search
        if (search) {
            condition.push({
                [Op.or]: [
                    { itemName: { [Op.substring]: search } },
                    { assetNumber: search },
                    { assetCategory: search }
                ]
            })
        }
        // Count Asset
        const totalAsset = await Asset.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get Tickets
        const asset = await Asset.findAll({
            limit: limit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            order: [
                ["createdAt", "ASC"]
            ]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset fetched successfully!`,
            totalPage: Math.ceil(totalAsset / limit),
            currentPage: currentPage,
            data: asset
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.getAllAssetForITTechnician = async (req, res) => {
    try {
        // Pagination
        const { page, recordLimit, search } = req.query;
        const limit = parseInt(recordLimit) || 5;
        let offSet = 0;
        let currentPage = 1;
        if (page) {
            offSet = (parseInt(page) - 1) * limit;
            currentPage = parseInt(page);
        }
        const condition = [{
            assetCategory: "IT",
            quantity: { [Op.gt]: 0 }
        }];
        // Include search
        if (search) {
            condition.push({
                [Op.or]: [
                    { itemName: { [Op.substring]: search } },
                    { assetNumber: search }
                ]
            })
        }
        // Count Asset
        const totalAsset = await Asset.count({
            where: {
                [Op.and]: condition
            }
        });
        // Get Assets
        const asset = await Asset.findAll({
            limit: limit,
            offset: offSet,
            where: {
                [Op.and]: condition
            },
            order: [
                ["createdAt", "ASC"]
            ],
            attributes: {
                exclude: ['quantity']
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset fetched successfully!`,
            totalPage: Math.ceil(totalAsset / limit),
            currentPage: currentPage,
            data: asset
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.updateAsset = async (req, res) => {
    try {
        const { itemName, assetCategory, quantity } = req.body;
        const asset = await Asset.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!asset) {
            return res.status(400).send({
                success: false,
                message: `Asset is not present!`
            });
        }
        await asset.update({
            ...asset,
            itemName: itemName,
            assetCategory: assetCategory,
            quantity: quantity
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset updated successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.assignAssetToEmployeeByTechnician = async (req, res) => {
    try {
        // Validate Body
        const { error } = assignAsset(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // FindAsset
        const { itemName, assetCategory, quantity, date, status, employeeAttendanceId } = req.body;
        const employee = await OrganizationMember.findOne({
            where: {
                attendanceId: employeeAttendanceId,
                post: "EMPLOYEE"
            }
        });
        if (!employee) {
            return res.status(400).send({
                success: false,
                message: `Employee(${employeeAttendanceId}) is not present!`
            });
        }
        const asset = await Asset.findOne({
            where: {
                itemName: itemName
            }
        });
        if (!asset) {
            return res.status(400).send({
                success: false,
                message: `This asset is not present!`
            });
        }
        // Check Asset quantity
        if (parseInt(asset.quantity) < parseInt(quantity)) {
            return res.status(400).send({
                success: false,
                message: `This asset's quantity is ${asset.quantity}. You can not assign more then ${asset.quantity}.`
            });
        }
        // Assign To Employee
        await EmployeeAsset.create({
            itemName: itemName,
            assetCategory: assetCategory,
            status: status.toUpperCase(),
            date: date,
            quantity: quantity,
            employeeId: employee.id,
            assetId: asset.id
        });
        // Update Asset Quantity
        const newQuantity = parseInt(asset.quantity) - parseInt(quantity);
        await asset.update({
            ...asset,
            quantity: newQuantity
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset assign to employee successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

// Not pagination
exports.getAllAssetAssignTOEmployee = async (req, res) => {
    try {
        const employee = await OrganizationMember.findAll({
            where: {
                id: req.params.id
            },
            include: [{
                model: EmployeeAsset,
                as: "emplyee_asset_association",
                include: [{
                    model: Asset,
                    as: "asset",
                    attributes: {
                        exclude: ['quantity']
                    }
                }]
            }]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset fetched successfully!`,
            data: employee
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};