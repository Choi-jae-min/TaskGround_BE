import * as workspaceSchema from "./workSpace.js";
import * as boardSchema from "./board.js";
import * as projectSchema from "./project.js";
import * as authSchema from "./auth.js"

export const schema = {
    ...workspaceSchema,
    ...projectSchema,
    ...boardSchema,
    ...authSchema
};
