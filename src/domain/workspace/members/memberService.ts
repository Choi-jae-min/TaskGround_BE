import {CreateMemberInput, MemberRepository} from "./memberRepository";

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
    constructor(private memberRepo: MemberRepository) {}

    async getMemberByWorkSpaceId(workSpaceId : string) {
        const memberList = await this.memberRepo.findMemberByWorkspaceId(workSpaceId);

        return memberList;
    }

    async addMemberToWorkspace(memberData : CreateMemberInput){
        return await this.memberRepo.createMember(memberData);
    }

    async updateMember(memberId: string, updateData: IMemberUpdateData) {
        return this.memberRepo.updateMember(memberId, updateData);
    }

}