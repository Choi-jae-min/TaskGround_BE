import * as workspaceSchema from "./workSpace";
import * as boardSchema from "./board";
import * as projectSchema from "./project";

export const schema = {
    ...workspaceSchema,
    ...projectSchema,
    ...boardSchema
};
