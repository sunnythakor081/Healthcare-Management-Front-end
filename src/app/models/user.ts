export class User 
{
    id?: number;
    username: string = '';
    email: string = '';
    gender: string = '';
    mobile: string = '';
    age: string = '';
    address: string = '';
    password: string = '';
    confirmPassword: string = '';
    termsAccepted: boolean = false;
    role?: string = 'user';
    status?: string = 'active';
    dateOfBirth?: string;
    profileImage?: string;
    createdAt?: Date;
    lastLogin?: Date;

    constructor() {}
}
