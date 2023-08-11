interface Page {
    id: number;
    name: string;
    crudPermissions?: string[];
    settingPermissions?: string[];
}

export const pages: Page[] = [
    {
        id: 1,
        name: 'Dashboard',
    },
    {
        id: 2,
        name: 'Users',
    },
    {
        id: 3,
        name: 'Roles',
    },
    {
        id: 4,
        name: 'Chat Rooms',
    },
    {
        id: 5,
        name: 'Notification',
    },
    {
        id: 6,
        name: 'Logs',
    },
    {
        id: 7,
        name: 'Customers',
    },
    {
        id: 8,
        name: 'Locations',
    },
    {
        id: 9,
        name: 'Internet Service Providers',
    },
    {
        id: 10,
        name: 'Customers Subscriptions',
    },
    {
        id: 11,
        name: 'Office Invoices',
    },
    {
        id: 12,
        name: 'Maintenance Invoices',
    },
    {
        id: 13,
        name: 'Subscription Invoices',
    },
    {
        id: 14,
        name: 'Products',
    },
    {
        id: 15,
        name: 'Products Inventory',
    },
    {
        id: 16,
        name: 'Assets',
    },
    {
        id: 17,
        name: 'Assets Inventory',
    },
]

interface CrudPermissions {
    id: number;
    name: string;
}

export const crudPermissions: CrudPermissions[] = [
    {
        id: 1,
        name: 'Read'
    },
    {
        id: 2,
        name: 'Create'
    },
    {
        id: 3,
        name: 'Update'
    },
    {
        id: 4,
        name: 'Delete'
    },
]

export const settingPermissions = []