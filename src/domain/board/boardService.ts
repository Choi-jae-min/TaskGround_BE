import {BoardRepository, CreateBoardInput} from "./boardRepository.js";

export class BoardService {
    constructor(private boardRepo: BoardRepository) {}
    async getBoardListByProjectId(projectId :string) {
        try {
            return await this.boardRepo.findBoardListByProjectId(projectId);
        }catch (error){
            console.error('error in getBoardListByProjectId' + (error as Error).message)
            throw new Error((error as Error).message)
        }
    }

    async createBoard(body : CreateBoardInput){
        try {
            return await this.boardRepo.createBoard(body);
        }catch (error){
            console.error('error in createBoard' + (error as Error).message)
            throw new Error((error as Error).message)
        }
    }
}