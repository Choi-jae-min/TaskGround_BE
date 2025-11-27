import {ProjectRepository} from "./project/repository.js";
import {WorkspaceRepository} from "./workspace/workspaceRepository.js";
import {ProjectService} from "./project/service.js";
import {WorkspaceService} from "./workspace/workspaceService.js";

export const createDomains = (db : any) => {
    const projectRepo = new ProjectRepository(db);
    const workspaceRepo = new WorkspaceRepository(db);

    return {
        repositories: { project: projectRepo, workspace: workspaceRepo },
        services: {
            project: new ProjectService(projectRepo),
            workspace: new WorkspaceService(workspaceRepo),
        },
    };
};