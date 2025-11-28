import {UserRepository} from "./authRepository";

export class AuthService {
    constructor(private userRepo: UserRepository) {}

    async checkIsValidEmail(email : string) {
        if (!email) {
            throw new Error("email is empty");
        }

        return !await this.userRepo.findUserByEmail(email);
    }

    async signUp(email : string , password : string , name : string){
        const isValidEmail = await this.checkIsValidEmail(email)

        console.log('isValidEmail' , isValidEmail)
    }

    // async getWorkspaceById(id : string){
    //     if(!id) throw new Error('id is missing')
    //
    //     return await this.userRepo.findWorkspaceById(id)
    // }
    //
    // async createWorkspace(data : CreateWorkspaceInput){
    //     return await this.userRepo.createWorkspace(data)
    // }
}