export class Appointment {
    patientname: string = '';
    patientid: string = '';
    email: string = '';
    doctorname: string = '';
    specialization: string = '';
    date: string = '';
    age: number = 0; // Yeh number banao
    gender: string = '';
    problem: string = '';
    slot: string = '';
    appointmentstatus: string = 'false';
    admissionstatus: string = 'false';

    constructor() {}
}