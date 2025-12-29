import {CreateMemberInput, MemberRepository} from "./memberRepository.js";
import {ProjectRepository} from "../../project/repository.js";

export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    GUEST = "GUEST",
}

export enum MemberStatus {
    INVITED = "INVITED",
    ACTIVE= "ACTIVE",
    LEFT = "LEFT",
    KICKED = "KICKED"
}

export interface IMemberUpdateData {
    role?: MemberRole;
    status?: MemberStatus
}
export class MemberService {
    constructor(private memberRepo: MemberRepository,private projectRepo :ProjectRepository) {}

    async getMemberByWorkSpaceId(workSpaceId : string) {
        return this.memberRepo.findMemberByWorkspaceId(workSpaceId);
    }

    async addMemberToWorkspace(memberData : CreateMemberInput){
        const [isMember] = await this.memberRepo.getMemberByWorkSpaceIdAndUserId(memberData.workspaceId,memberData.userId);
        if(isMember){
            throw new Error('이미 워크스페이스 에 등록된 맴버입니다.')
        }
        return await this.memberRepo.createMember(memberData);
    }

    async getMemberByProjectId(projectId : string){
        const workspaceId = await this.projectRepo.getWorkspaceIdByProjectId(projectId);
        const workspaceMemberList = await this.memberRepo.findMemberByWorkspaceId(workspaceId);
        if (workspaceMemberList){
            return workspaceMemberList.map((m) => {
                return m.user.name
            })
        }
        return "FAIL"
    }

    async updateMember(memberId: string, updateData: IMemberUpdateData) {
        return this.memberRepo.updateMember(memberId, updateData);
    }

}