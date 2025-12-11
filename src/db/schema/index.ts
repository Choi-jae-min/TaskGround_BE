import * as workspaceSchema from "./workSpace.js";
import * as boardSchema from "./board.js";
import * as projectSchema from "./project.js";
import * as authSchema from "./auth.js"
import * as taskSchema from "./task.js"
import * as tagSchema from "./tags.js"

export const schema = {
    ...workspaceSchema,
    ...projectSchema,
    ...boardSchema,
    ...authSchema,
    ...taskSchema,
    ...tagSchema,
};
