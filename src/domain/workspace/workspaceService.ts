import {CreateWorkspaceInput, WorkspaceRepository} from "./workspaceRepository.js";

export class WorkspaceService {
    constructor(private workSpaceRepo: WorkspaceRepository) {}

    async getWorkspaceByPagination(limit: number, offset: number) {
        if (limit > 100) {
            throw new Error("Limit cannot exceed 100");
        }

        return await this.workSpaceRepo.findWorkSpacePagination(limit,offset)
    }

    async getWorkspaceById(id : string){
        if(!id) throw new Error('id is missing')

        return await this.workSpaceRepo.findWorkspaceById(id)
    }

    async createWorkspace(data : CreateWorkspaceInput){
        return await this.workSpaceRepo.createWorkspace(data)
    }
}