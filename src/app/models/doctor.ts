export class Doctor 
{
    id?: number;
    doctorname: string = '';
    email: string = '';
    gender: string = '';
    mobile: string = '';
    experience: string = '';
    address: string = '';
    specialization: string = '';
    previoushospital: string = '';
    password: string = '';
    status: string = 'false';
    qualification: string = '';
    consultationFee: number = 0;
    dateOfBirth?: string;
    profileImage?: string;
    departmentId?: number;
    departmentName?: string;
    availableDays?: string[];
    availableTimeSlots?: string[];

    constructor() {}
}
