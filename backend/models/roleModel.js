const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        access: [
            {
                page: {
                    type: String,
                    required: true,
                },
                crudPermissions: {
                    type: [String],
                    default: [],
                },
                settingPermissions: {
                    type: [String],
                    default: [],
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.Role || mongoose.model('Role', roleSchema);