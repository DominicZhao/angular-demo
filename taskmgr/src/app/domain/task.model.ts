export interface Task {
    id?: string;
    desc: string;
    completed: boolean;
    priority: number;
    dueDate?: Date;
    reminder?: Date;
    remark?: string;
    creatDate: Date;
    ownerId?: string;
    particpantIds: string[];
    taskListId: string;
}
