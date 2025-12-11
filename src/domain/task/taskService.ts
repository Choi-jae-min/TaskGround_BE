import {CreateTaskInput, TaskRepository} from "./taskRepository.js";

export class TaskService{
    constructor(private taskRepo :TaskRepository) {}

    async createTask(body :CreateTaskInput){
        try {
            return await this.taskRepo.createTask(body);
        }catch (error){
            console.error('error in createTask' + (error as Error).message)
            throw new Error((error as Error).message)
        }
    }
}