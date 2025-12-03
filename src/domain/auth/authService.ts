import {UserRepository} from "./authRepository";
import bcrypt from "bcryptjs";
import {signAccessToken, signRefreshToken} from "../../lib/jwt.js";

export class AuthService {
    constructor(private userRepo: UserRepository) {}

    async checkIsValidEmail(email : string) {
        if (!email) {
            throw new Error("email is empty");
        }
        const isUser = await this.userRepo.findUserByEmail(email);
        return !!isUser
    }



    async signUp(email : string , password : string , name : string){
        const isValidEmail = await this.checkIsValidEmail(email)
        if(isValidEmail){
           throw new Error(`이미 가입된 회원 이메일입니다. 로그인 해주세요`)
        }

        const passwordHash = await bcrypt.hash(password, 10);
        return await this.userRepo.signUp(email , passwordHash , name)
    }

    async signIn(email :string , password :string){
        const isUser = await this.userRepo.findUserByEmail(email);
        if(!isUser){
            throw new Error(`잘못된 이메일`)
        }

        const isValidPassword = await bcrypt.compare(password, isUser.passwordHash || '');

        if (!isValidPassword) {
            throw new Error("INVALID_PASSWORD");
        }

        const accessToken = await signAccessToken({ sub: isUser.id, email });
        const refreshToken = await signRefreshToken({ sub: isUser.id, email });
        await this.userRepo.updateUserLastLoginAtById(isUser.id);

        return {accessToken , refreshToken}
    }
}