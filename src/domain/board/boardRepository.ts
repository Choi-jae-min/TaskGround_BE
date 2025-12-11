import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {schema} from "../../db/schema/index.js";
import {board} from "../../db/schema/board.js";
import {eq} from "drizzle-orm";

type BoardInsert = typeof board.$inferInsert;

export type CreateBoardInput = Omit<BoardInsert, "id" | "createdAt" | "updatedAt">;

export class BoardRepository {
    constructor(private db: NodePgDatabase<typeof schema>) {}

    async findBoardListByProjectId(projectId : string) {
        return this.db.query.board.findMany({
            where: eq(board.projectId, projectId),
            with: {
                task : true
            },
        });
    }

    async createBoard(body : CreateBoardInput){
        const [board] = await this.db
            .insert(schema.board)
            .values(body)
            .returning();

        return board
    }
}