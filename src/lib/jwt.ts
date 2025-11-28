import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
}

export interface TokenPayload extends JwtPayload {
    sub: string;
    email: string;
}

const accessTokenOptions: SignOptions = {
    algorithm: "HS256",
    expiresIn: "15m",
};

const refreshTokenOptions: SignOptions = {
    algorithm: "HS256",
    expiresIn: "7d",
};

export async function signAccessToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET!, accessTokenOptions, (err, token) => {
            if (err || !token) return reject(err);
            resolve(token);
        });
    });
}

export async function signRefreshToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, JWT_SECRET!, refreshTokenOptions, (err, token) => {
            if (err || !token) return reject(err);
            resolve(token);
        });
    });
}

export async function verifyToken(token: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET!, (err, decoded) => {
            if (err || !decoded) return reject(err);
            resolve(decoded as TokenPayload);
        });
    });
}
