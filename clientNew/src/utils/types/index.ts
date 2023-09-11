export interface User {
    _id: string;
    name: string;
    picture: string;
    status: string;
    username: string;
    role?: Role;
    createdAt: string;
    updatedAt: string;
}

type RoleAccess = {
    id: number;
    page: string;
    crudPermissions: string[];
}

export interface Role {
    _id: string;
    name: string;
    access: RoleAccess[];
    createdAt: Date;
    updatedAt: Date;
}