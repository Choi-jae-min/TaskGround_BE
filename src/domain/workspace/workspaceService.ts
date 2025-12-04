import {CreateWorkspaceInput, WorkspaceRepository} from "./workspaceRepository.js";
import {UserRepository} from "../auth/authRepository.js";

export class WorkspaceService {
    constructor(private workSpaceRepo: WorkspaceRepository , private authRepo : UserRepository) {}

    async getWorkspaceByPagination(limit: number, offset: number) {
        if (limit > 100) {
            throw new Error("Limit cannot exceed 100");
        }

        return await this.workSpaceRepo.findWorkSpacePagination(limit,offset)
    }

    async getWorkspaceById(id : string){
        if(!id) throw new Error('id is missing')

        const workspace = await this.workSpaceRepo.findWorkspaceById(id)
        if(!workspace) throw new Error('workspace is missing')

        const user = await this.authRepo.findUserByEId(workspace?.ownerId)

        console.log( {...workspace , ownerName : user?.name})
        return {...workspace , ownerName : user?.name}
    }

    async createWorkspace(data : CreateWorkspaceInput){
        return await this.workSpaceRepo.createWorkspace(data)
    }
}