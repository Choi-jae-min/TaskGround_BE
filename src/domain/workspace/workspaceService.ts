import {CreateWorkspaceInput, WorkspaceRepository} from "./workspaceRepository.js";
import {UserRepository} from "../auth/authRepository.js";
import {CreateMemberInput, MemberRepository} from "./members/memberRepository";

export class WorkspaceService {
    constructor(private workSpaceRepo: WorkspaceRepository , private authRepo : UserRepository, private memberRepo : MemberRepository) {}

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

        return {...workspace , ownerName : user?.name}
    }

    async createWorkspace(data : CreateWorkspaceInput){
        try {
            const createdWorkspace = await this.workSpaceRepo.createWorkspace(data);
            if(createdWorkspace) {
                const memberData : CreateMemberInput = {
                    workspaceId : createdWorkspace.id,
                    userId : createdWorkspace.ownerId,
                    role : "OWNER"
                }
                await this.memberRepo.createMember(memberData)
            }
            return createdWorkspace
        }catch (error){
            console.error('error in create member' + (error as Error).message)
            throw new Error((error as Error).message)
        }
    }

    async getWorKSpaceListByMemberId(memberId : string){
        if(!memberId) throw new Error('member id is missing')

        return await this.workSpaceRepo.findWorkspacesByMemberId(memberId);
    }
}