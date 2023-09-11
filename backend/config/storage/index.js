const multer = require('multer');
const fs = require('fs');

// upload profile picture
const profilePictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user.id; // get the user ID from the request user
        const dirPath = `public/images/user/${userId}/profile`; // construct the directory path
        fs.mkdirSync(dirPath, { recursive: true }); // create the directory if it doesn't exist
        cb(null, dirPath); // set the directory path as the destination
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname; // generate a unique file name
        cb(null, fileName);
    }
});

// update user profile pic admin
const userProfilePictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.params.id; // get the user ID from the request user
        const dirPath = `public/images/user/${userId}/profile`; // construct the directory path
        fs.mkdirSync(dirPath, { recursive: true }); // create the directory if it doesn't exist
        cb(null, dirPath); // set the directory path as the destination
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname; // generate a unique file name
        cb(null, fileName);
    }
});
const profilePictureFilter = function (req, file, cb) {
    // Accept only .webp files
    if (!file.originalname.match(/\.(webp|jpeg|jpg|png)$/)) {
        const error = new Error('Only .webp, .jpeg, .png and .jpg files are allowed!');
        return cb(error, false);
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) { // 5 MB limit
        const error = new Error('File size limit exceeded (max 5 MB)');
        return cb(error, false);
    }
    cb(null, true);
};

const toBeEditedStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const ticketId = req.params.id; // get the ticket ID from the request parameters
        const dirPath = `public/images/support/ticket/${ticketId}`; // construct the directory path
        fs.mkdirSync(dirPath, { recursive: true }); // create the directory if it doesn't exist
        cb(null, dirPath); // set the directory path as the destination
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname; // generate a unique file name
        cb(null, fileName);
    }
});

const multipleFileFilter = function (req, file, cb) {
    // Accept only .webp files
    if (!file.originalname.match(/\.(webp|jpeg|jpg)$/)) {
        const error = new Error('Only .webp, .jpeg and .jpg files are allowed!');
        return cb(error, false);
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) { // 5 MB limit
        const error = new Error('File size limit exceeded (max 5 MB)');
        return cb(error, false);
    }
    cb(null, true);
};

const uploadProfilePictureStorage = multer({ storage: profilePictureStorage, fileFilter: profilePictureFilter });
const uploadUserProfilePicStorage = multer({ storage: userProfilePictureStorage, fileFilter: profilePictureFilter });

const uploadMultipleImage = multer({ storage: toBeEditedStorage, fileFilter: multipleFileFilter })
    .array('images', 6);

module.exports = {
    uploadProfilePictureStorage,
    uploadUserProfilePicStorage,
    uploadMultipleImage
}
