const path = require("path");
const multer = require("multer");

const filter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else if (file.mimetype.startsWith("application/pdf")) {
        cb(null, true);
    } else {
        cb("Please upload only Image and PDF.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(__dirname);
        const filePath = path.join(`${__dirname}../Resource`);
        if (file.fieldname === "attachment") {
            cb(null, filePath);
        }
    },
    filename: (req, file, callback) => {
        var filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

exports.uploadAttachment = multer({ storage: storage, fileFilter: filter });

