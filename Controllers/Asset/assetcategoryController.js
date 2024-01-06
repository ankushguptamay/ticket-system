const db = require('../../Models');
const AssetCategory = db.assetCategory;
const { createAssetCategory } = require("../../Middlewares/validate");

exports.createAssetCategory = async (req, res) => {
    try {
        // Validate Body
        const { error } = createAssetCategory(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { categoryName } = req.body;
        // check name duplicacy
        const isDuplicate = await AssetCategory.findOne({
            where: {
                categoryName: categoryName
            }
        });
        if (isDuplicate) {
            return res.status(400).send({
                success: false,
                message: `This asset category is already present!`
            });
        }
        // Generating category number
        let number;
        const assetCategories = await AssetCategory.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        });
        const day = new Date().toISOString().slice(8, 10);
        const year = new Date().toISOString().slice(2, 4);
        const month = new Date().toISOString().slice(5, 7);
        if (assetCategories.length == 0) {
            number = day + month + year + 'ASSCAT' + 1000;
        } else {
            let lastCategory = assetCategories[assetCategories.length - 1];
            let lastDigits = lastCategory.categoryNumber.substring(12);
            let incrementedDigits = parseInt(lastDigits, 10) + 1;
            number = day + month + year + 'ASSCAT' + incrementedDigits;
        }
        await AssetCategory.create({
            categoryName: categoryName,
            categoryNumber: number
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset category created successfully! Category Number ${number}`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.getAssetCategory = async (req, res) => {
    try {
        const assetCategories = await AssetCategory.findAll({
            order: [
                ['createdAt', 'ASC']
            ]
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset category fetched successfully!`,
            data: assetCategories
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.deleteAssetCategory = async (req, res) => {
    try {
        const assetCategory = await AssetCategory.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!assetCategory) {
            return res.status(400).send({
                success: false,
                message: `Asset category is not present!`
            });
        }
        await assetCategory.destroy();
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset category deleted successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.updateAssetCategory = async (req, res) => {
    try {
        const assetCategory = await AssetCategory.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!assetCategory) {
            return res.status(400).send({
                success: false,
                message: `Asset category is not present!`
            });
        }
        const { categoryName } = req.body;
        if (categoryName !== assetCategory.categoryName) {
            const isPresent = await AssetCategory.findOne({
                where: {
                    categoryName: categoryName
                }
            });
            if (isPresent) {
                return res.status(400).send({
                    success: false,
                    message: `This asset category is already present!`
                });
            }
        }
        await assetCategory.update({
            ...assetCategory,
            categoryName: categoryName
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: `Asset category deleted successfully!`
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};