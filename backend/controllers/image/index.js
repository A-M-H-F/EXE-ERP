const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Get profile picture
// @route   GET /images/profile/picture
// @access  Private - authMiddleware
const getProfilePicture = asyncHandler(async (req, res) => {
    const { src } = req.query

    if (req.user.picture !== src) {
        res.status(400);
        throw new Error('Not authorized');
    }

    const filePath = path.join(__dirname, '..', '..', 'public', src);

    if (filePath) {
        res.status(200).sendFile(filePath)
    } else {
        res.status(400);
        throw new Error('File not found')
    }
})

const getUsersProfilePictures = asyncHandler(async (req, res) => {
    const { src } = req.query

    const filePath = path.join(__dirname, '..', '..', 'public', src);

    if (filePath) {
        res.status(200).sendFile(filePath)
    } else {
        res.status(400);
        throw new Error('File not found')
    }
})

const getBuildingImage = asyncHandler(async (req, res) => {
    const { src } = req.query

    const filePath = path.join(__dirname, '..', '..', 'public', src);

    if (filePath) {
        res.status(200).sendFile(filePath)
    } else {
        res.status(400);
        throw new Error('File not found')
    }
})

// conditions check
// if (src.startsWith('/images/support/ticket')) {
//     const idStartIndex = src.indexOf('/ticket/') + 8; // Add 8 to skip '/ticket/'
//     const idEndIndex = src.indexOf('/', idStartIndex);
//     if (idEndIndex !== -1) {
//         const id = src.slice(idStartIndex, idEndIndex);
//         if (id) {
//             const checkTicket = await SupportTicket.findById(id).lean();

//             if (!checkTicket) {
//                 res.status(400);
//                 throw new Error('Ticket files not found');
//             }

//             if (String(checkTicket.from) !== req.user.id) {
//                 res.status(400);
//                 throw new Error('Not authorized');
//             }
//         }
//     }
// }

module.exports = {
    getProfilePicture,
    getUsersProfilePictures,
    getBuildingImage
}