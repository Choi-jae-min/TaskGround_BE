import {ProjectRepository} from "./project/repository.js";
import {WorkspaceRepository} from "./workspace/workspaceRepository.js";
import {ProjectService} from "./project/service.js";
import {WorkspaceService} from "./workspace/workspaceService.js";
import {UserRepository} from "./auth/authRepository.js";
import {AuthService} from "./auth/authService.js";
import {MemberRepository} from "./workspace/members/memberRepository.js";
import {MemberService} from "./workspace/members/memberService.js";

export const createDomains = (db : any) => {
    const projectRepo = new ProjectRepository(db);
    const workspaceRepo = new WorkspaceRepository(db);
    const authRepo = new UserRepository(db);
    const memberRepo = new MemberRepository(db);

    return {
        repositories: { project: projectRepo, workspace: workspaceRepo },
        services: {
            project: new ProjectService(projectRepo),
            workspace: new WorkspaceService(workspaceRepo),
            auth : new AuthService(authRepo),
            member : new MemberService(memberRepo)
        },
    };
};