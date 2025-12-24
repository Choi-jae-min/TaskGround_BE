import {CreateTaskInput, TaskRepository, UpdateTaskInput} from "./taskRepository.js";

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

    async updateTask(taskId : string , body : UpdateTaskInput){
        try {
            return await this.taskRepo.updateTask(taskId , body);
        }catch (error){
            console.error('error in createTask' + (error as Error).message)
            throw new Error((error as Error).message)
        }
    }
}