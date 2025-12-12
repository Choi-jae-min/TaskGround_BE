import {CreateProjectInput, ProjectRepository} from "./repository.js";

export class ProjectService {
    constructor(private projectRepo: ProjectRepository) {}

    async getProjectList(limit: number, offset: number) {
        if (limit > 100) {
            throw new Error("Limit cannot exceed 100");
        }

        return await this.projectRepo.findMany(limit, offset);
    }

    async createProject(projectData : CreateProjectInput){
       return await this.projectRepo.createProject(projectData)
    }

    async getProjectById(id : string){
        try {
            return await this.projectRepo.getProjectById(id);
        }catch (error){
            throw new Error((error as Error).message)
        }
    }
}