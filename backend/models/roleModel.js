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
                allowed: [
                    {
                        name: {
                            type: String,
                            required: true,
                        },
                        permissions: {
                            type: [String],
                            default: [],
                        },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

// The name field represents the name of the role(e.g., admin, moderator, accountant, cashier).

// The access field is an array that holds objects representing the access permissions for different pages.

// Each access object has a page field to specify the page name(e.g., users list page) and an allowed field,
// which is an array of objects representing the allowed components and their permissions on that page.

// Each allowed object has a name field to specify the component name and a permissions field,
// which is an array of strings representing the permissions granted for that component.

    module.exports = mongoose.model('Role', roleSchema);