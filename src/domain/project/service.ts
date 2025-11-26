import { ProjectRepository } from "./repository.js";

export class ProjectService {
    constructor(private projectRepo: ProjectRepository) {}

    async getProjectList(limit: number, offset: number) {
        if (limit > 100) {
            throw new Error("Limit cannot exceed 100");
        }

        return await this.projectRepo.findMany(limit, offset);
    }

    // async getProjectById(id: string) {
    //     const project = await this.projectRepo.findById(id);
    //
    //     if (!project) {
    //         throw new Error("Project not found");
    //     }
    //
    //     // 추가 비즈니스 로직 (예: 권한 체크, 로깅 등)
    //     return project;
    // }
}