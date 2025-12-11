import {ProjectRepository} from "./project/repository.js";
import {WorkspaceRepository} from "./workspace/workspaceRepository.js";
import {ProjectService} from "./project/service.js";
import {WorkspaceService} from "./workspace/workspaceService.js";
import {UserRepository} from "./auth/authRepository.js";
import {AuthService} from "./auth/authService.js";
import {MemberRepository} from "./workspace/members/memberRepository.js";
import {MemberService} from "./workspace/members/memberService.js";
import {BoardRepository} from "./board/boardRepository.js";
import {BoardService} from "./board/boardService.js";
import {TaskRepository} from "./task/taskRepository.js";
import {TaskService} from "./task/taskService.js";

export const createDomains = (db : any) => {
    const projectRepo = new ProjectRepository(db);
    const workspaceRepo = new WorkspaceRepository(db);
    const authRepo = new UserRepository(db);
    const memberRepo = new MemberRepository(db);
    const boardRepo = new BoardRepository(db);
    const taskRepo = new TaskRepository(db)

    return {
        repositories: { project: projectRepo, workspace: workspaceRepo },
        services: {
            project: new ProjectService(projectRepo),
            workspace: new WorkspaceService(workspaceRepo , authRepo , memberRepo),
            board : new BoardService(boardRepo),
            task : new TaskService(taskRepo),
            auth : new AuthService(authRepo),
            member : new MemberService(memberRepo)
        },
    };
};