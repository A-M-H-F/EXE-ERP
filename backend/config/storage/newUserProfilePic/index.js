const multer = require('multer');
const fs = require('fs');

// upload profile picture
const newUserProfilePicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = String(req.newUser._id);
        const dirPath = `public/images/user/${userId}/profile`;
        fs.mkdirSync(dirPath, { recursive: true });
        cb(null, dirPath);
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

const uploadNewUserProfilePicStorage = multer({
    storage: newUserProfilePicStorage,
    fileFilter: profilePictureFilter
});

module.exports = {
    uploadNewUserProfilePicStorage
}
