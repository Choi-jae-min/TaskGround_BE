import {MemberRepository} from "./memberRepository";

export class WorkspaceService {
    constructor(private memberRepo: MemberRepository) {}

    async getMemberByWorkSpaceId(workSpaceId : string) {
        return await this.memberRepo.findMemberByWorkspaceId(workSpaceId);
    }
}