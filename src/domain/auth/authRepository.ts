import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {eq} from "drizzle-orm";
import {users} from "../../db/schema/auth.js";

type UserInsert = typeof users.$inferInsert;

export type CreateUserInput = Omit<UserInsert, "id" | "createdAt" | "updatedAt">;

export class UserRepository {
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async findUserByEmail(email : string ) {
        return this.db.query.users.findFirst({
            where: eq(users.email, email)
        });
    }

    async findUserByEId(id : string ) {
        return this.db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                passwordHash: false,
            },
        });
    }

    async signUp(email : string, passwordHash : string, name : string){
        const [user] = await this.db
            .insert(users)
            .values({
                email,
                passwordHash,
                name,
            })
            .returning();

        return user;
    }

    async updateUserLastLoginAtById(id :string){
        const [updated] = await this.db
            .update(users)
            .set({
                lastLoginAt: new Date()
            })
            .where(eq(users.id, id))
            .returning();

        return updated;
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