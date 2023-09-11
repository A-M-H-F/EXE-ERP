export type Role = {
    name: string;
    access: {
        page: string;
        crudPermissions: string[];
        settingPermissions: string[];
    }[];
};

export const hasAccessToPage = (userRole: Role | undefined, currentPage: string | undefined): boolean => {
    const accessToPage = userRole?.access?.find((access) => access.page === currentPage);
    return !!accessToPage;
}

export const hasPermission = (
    userRole: Role | undefined,
    targetPage: string,
    requiredPermission: string
): boolean => {
    const accessToPage = userRole?.access?.find((access) => access.page === targetPage);
    if (!accessToPage) {
        return false; // User does not have access to the specified page
    }

    const { crudPermissions, settingPermissions } = accessToPage;

    // Check if the required permission is present in either CRUD permissions or setting permissions
    return crudPermissions.includes(requiredPermission) || settingPermissions.includes(requiredPermission);
}