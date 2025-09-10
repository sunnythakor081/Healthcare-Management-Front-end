export class Department {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    active: boolean;
    doctorCount: number;

    constructor() {
        this.id = 0;
        this.name = '';
        this.description = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.active = true;
        this.doctorCount = 0;
    }
}