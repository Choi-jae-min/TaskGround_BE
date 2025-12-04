import {CreateMemberInput, MemberRepository} from "./memberRepository";

export class MemberService {
    constructor(private memberRepo: MemberRepository) {}

    async getMemberByWorkSpaceId(workSpaceId : string) {
        return await this.memberRepo.findMemberByWorkspaceId(workSpaceId);
    }

    async addMemberToWorkspace(memberData : CreateMemberInput){
        return await this.memberRepo.createMember(memberData);
    }
}