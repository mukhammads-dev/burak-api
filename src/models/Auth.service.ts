import { AUTH_TIMER } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";


class AuthService {
    private readonly secretToken;
    constructor() {
        this.secretToken = process.env.SECRET_TOKEN as string;
    }
    // argument type member boladi
    public async createToken(payload: Member) {
        return new Promise((resolve, reject) => {
            const duration = `${AUTH_TIMER}h`;
            jwt.sign(payload, // nima saqlash → member ma'lumoti
                process.env.SECRET_TOKEN as string, { // 2: maxfiy kalit → yasash uchun
                expiresIn: duration, // 3: qachon tugaydi → 3 soatdan keyin
            }, (err, token) => {
                if (err) reject(new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED));
                else resolve(token as string); // token qaytaradi
            });
        });
    }

    public async checkAuth(token: string): Promise<Member> {
        const result: Member = (await jwt.verify( // browserdan kelgan token
            token, this.secretToken               // maxfiy kalit bilan tekshiradi
        )) as Member;
        // token o'zgartirilgan bo'lsa → xato chiqaradi
        // vaqti o'tgan bo'lsa → xato chiqaradi
        // hammasi to'g'ri → member ma'lumotini qaytaradi
        console.log(`---- [AUTH] memberNick: ${result.memberNick} ---`);
        return result;
    }

}


export default AuthService