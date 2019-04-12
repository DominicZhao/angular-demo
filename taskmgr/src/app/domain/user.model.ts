export enum IdentityType {
    IdCard = 0,
    Insurance,
    Passport,
    Military,
    Other
}

export interface Address {
    province: string;
    city: string;
    district: string;
    street?: string;
}

export interface Identity {
    identityNo: string;
    identityType: IdentityType;
}

export interface User {
    id?: string;
    email: string;
    password: string;
    name: string;
    avatar: string;
    projedtIds: string[];
    address?: Address;
    identity?: Identity;
    dateOfBirth?: string;
}
