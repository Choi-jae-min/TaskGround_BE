import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {eq} from "drizzle-orm";
import {users} from "../../db/schema/auth.js";

type UserInsert = typeof users.$inferInsert;

export type CreateUserInput = Omit<UserInsert, "id" | "createdAt" | "updatedAt">;

export class UserRepository {
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async findUserByEmail(email : string ) {
        const isUser = await this.db.query.users.findFirst({
            where: eq(users.email , email)
        })

        console.log('isUser' , isUser)
        return !!isUser;
    }
//
//     const workspace = await this.db.query.workspaces.findFirst({
//         where: eq(workspaces.id, id),
//         with: {
//             // members: true,
//             projects: true,
//         },
//     });
//
//     if(!workspace){
//     return {}
// }
//
// return workspace


    // async createWorkspace(data: CreateUserInput) {
    //     const [workspace] = await this.db
    //         .insert(schema.workspaces)
    //         .values(data)
    //         .returning();
    //
    //     return workspace;
    // }
}