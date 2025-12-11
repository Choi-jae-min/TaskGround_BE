import * as workspaceSchema from "./workSpace";
import * as boardSchema from "./board";
import * as projectSchema from "./project";
import * as authSchema from "./auth"

export const schema = {
    ...workspaceSchema,
    ...projectSchema,
    ...boardSchema,
    ...authSchema
};
