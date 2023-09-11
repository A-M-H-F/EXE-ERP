interface Page {
    id: number;
    page: string;
    crudPermissions?: string[];
    settingPermissions?: string[];
}

export const pages: Page[] = [
    {
        id: 1,
        page: 'Dashboard',
    },
    {
        id: 2,
        page: 'Users',
    },
    {
        id: 3,
        page: 'Roles',
    },
    {
        id: 4,
        page: 'Chat Rooms',
    },
    {
        id: 5,
        page: 'Notification',
    },
    {
        id: 6,
        page: 'Logs',
    },
    {
        id: 7,
        page: 'Customers',
    },
    {
        id: 8,
        page: 'Locations',
    },
    {
        id: 9,
        page: 'Internet Service Providers',
    },
    {
        id: 10,
        page: 'Customers Subscriptions',
    },
    {
        id: 11,
        page: 'Office Invoices',
    },
    {
        id: 12,
        page: 'Maintenance Invoices',
    },
    {
        id: 13,
        page: 'Subscription Invoices',
    },
    {
        id: 14,
        page: 'Products',
    },
    {
        id: 15,
        page: 'Products Inventory',
    },
    {
        id: 16,
        page: 'Assets',
    },
    {
        id: 17,
        page: 'Assets Inventory',
    },
    {
        id: 18,
        page: 'Internet Services',
    },
    {
        id: 19,
        page: 'IT Services',
    },
    {
        id: 20,
        page: 'Scrum Board',
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