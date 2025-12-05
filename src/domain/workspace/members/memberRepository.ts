import {NodePgDatabase} from "drizzle-orm/node-postgres";
import {workspaceMembers} from "../../../db/schema/workSpace.js";
import {schema} from "../../../db/schema/index.js";
import {eq, or} from "drizzle-orm";
import {IMemberUpdateData} from "./memberService.js";

type MemberInsert = typeof workspaceMembers.$inferInsert;

export type CreateMemberInput = Omit<MemberInsert, "id" | "createdAt" | "updatedAt" | "status">;

export class MemberRepository {
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async findMemberByWorkspaceId(workSpaceId : string) {
        return this.db.query.workspaceMembers.findMany({
            where: eq(workspaceMembers.workspaceId, workSpaceId),
            with: {
                user: {
                    columns: {
                        name: true,
                        email: true,
                    }
                },
            },
        })
    }


    async getMemberByWorkSpaceIdAndUserId(workSpaceId:string , userId :string){
        return this.db.select().from(workspaceMembers).where(
            or(
                eq(workspaceMembers.userId, userId),
                eq(workspaceMembers.workspaceId, workSpaceId)
            )
        )
    }

    async createMember(memberData : CreateMemberInput){
        try {
            const [member] = await this.db
                .insert(schema.workspaceMembers)
                .values(memberData)
                .returning();

            return member
        }catch (error : any) {
            console.error('error in create member' + (error as Error).message)
            throw new Error((error as Error).message)
        }
    }

    async updateMember(memberId: string, input: IMemberUpdateData) {
        return this.db
            .update(workspaceMembers)
            .set(input)
            .where(eq(workspaceMembers.id, memberId))
            .returning();
    }
}