import {CreateProjectInput, ProjectRepository} from "./repository.js";

export class ProjectService {
    constructor(private projectRepo: ProjectRepository) {}

    async getProjectList(limit: number, offset: number) {
        if (limit > 100) {
            throw new Error("Limit cannot exceed 100");
        }

        return await this.projectRepo.findMany(limit, offset);
    }

    async getProjectCountsByWorkspace(workspaceId : string[]){
        const counts = await Promise.all(
            workspaceId.map((wId) =>
                this.projectRepo.getProjectCountByWorkspaceId(wId)
            )
        );

        return counts.reduce((sum, count) => sum + count, 0);
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