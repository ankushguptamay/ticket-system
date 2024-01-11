const joi = require('joi');
const pattern = "/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/";

exports.adminRegistration = (data) => {
    const schema = joi.object().keys({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required().label('Email'),
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
    }) // .options({ allowUnknown: true });
    return schema.validate(data);
}

// for all
exports.login = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
    });
    return schema.validate(data);
}

// for all
exports.changePassword = (data) => {
    const schema = joi.object().keys({
        currentPassword: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8),
        newPassword: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
    });
    return schema.validate(data);
}

exports.memberRegistration = (data) => {
    const schema = joi.object().keys({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required().label('Email'),
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        post: joi.string().required(),
        department: joi.string().required(),
        attendanceId: joi.string().required(),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
    });
    return schema.validate(data);
}

exports.createAttachment = (data) => {
    const schema = joi.object().keys({
        ticketCategory: joi.string().required(),
        subject: joi.string().required(),
        details: joi.string().max(1000).required()
    });
    return schema.validate(data);
}

exports.createAsset = (data) => {
    const schema = joi.object().keys({
        quantity: joi.string().required(),
        itemName: joi.string().required(),
        assetCategory: joi.string().required(),
        itemSerialNumber: joi.string().required()
    });
    return schema.validate(data);
}

exports.createAssetCategory = (data) => {
    const schema = joi.object().keys({
        categoryName: joi.string().required()
    });
    return schema.validate(data);
}

exports.assignAsset = (data) => {
    const schema = joi.object().keys({
        status: joi.string().required(),
        quantity: joi.string().required(),
        itemName: joi.string().required(),
        assetCategory: joi.string().required(),
        date: joi.string().required(),
        employeeAttendanceId: joi.string().required()
    });
    return schema.validate(data);
}

exports.memberUpdationAdmin = (data) => {
    const schema = joi.object().keys({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required().label('Email'),
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        post: joi.string().required(),
        department: joi.string().required(),
        attendanceId: joi.string().required()
    });
    return schema.validate(data);
}

exports.memberUpdation = (data) => {
    const schema = joi.object().keys({
        name: joi.string().min(3).max(30).required()
    });
    return schema.validate(data);
}