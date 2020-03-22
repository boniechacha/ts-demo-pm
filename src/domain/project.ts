export enum Status {
    ACTIVE = 'active',
    FINISHED = 'finished'
}

export class Project {
    id: string;
    title: string;
    description: string;
    peopleCount: number;
    status: Status;


    constructor(title: string, description: string, peopleCount: number) {
        this.id = Math.random().toString();
        this.status = Status.ACTIVE;

        this.title = title;
        this.description = description;
        this.peopleCount = peopleCount;
    }
}