import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberType } from "../libs/enums/member.enum";
import { error } from "console";
import * as bcrypt from "bcryptjs";



class MemberService {
    private readonly memberModel;

    constructor() {
        // STEP 5: Model bilan bog'lanish
        this.memberModel = MemberModel;
    }

    /** SPA=========== */
    // Define
    public async signup(input: MemberInput): Promise<Member> {
        /// STEP 3: 
        const salt = await bcrypt.genSalt();
        // STEP 4: 
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            // STEP 5: 
            const result = await this.memberModel.create(input);
            // STEP 6: 
            result.memberPassword = "";

            // STEP 7: 
            return result.toJSON();
        } catch (err) {
            // STEP 10: 
            console.error("Error, model:signup", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
        }
    }

    public async login(input: LoginInput): Promise<Member> {
        // TODO: Consider member status later 
        const member = await this.memberModel
            // STEP 3
            .findOne(
                { memberNick: input.memberNick },
                { memberNick: 1, memberPassword: 1 }
            )
            .exec();
        // STEP 4
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        // STEP 5 password checking
        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
        // STEP 6:
        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }
        // STEP 7: Password to'g'ri bo'lsa to'liq memberni olish
        return await this.memberModel.findById(member._id).lean().exec(); // lean => only data 
    }

    /** BSSR============ */
    // Define
    public async processSignup(input: MemberInput): Promise<Member> {
        //STEP 6: Restaurant owner mavjudligini tekshirish
        const exist = await this.memberModel
            .findOne({ memberType: MemberType.RESTAURANT })
            .exec();
        //STEP 7: Mavjud bo'lsa signupni to'xtatish
        if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        const salt = await bcrypt.genSalt();
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            // STEP 8: Yangi memberni databasega saqlash
            const result = await this.memberModel.create(input);
            // STEP 11: Passwordni response uchun yashirish
            result.memberPassword = "";
            // STEP 12: Natijani Controllerga qaytarish
            return result;
        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async processLogin(input: LoginInput): Promise<Member> {
        // STEP 4: Username boyicha memberni qidirish
        const member = await this.memberModel
            .findOne(
                { memberNick: input.memberNick },
                { memberNick: 1, memberPassword: 1 }
            )
            .exec();
        // STEP 5: Member topilmasa xato qaytarish
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        // STEP 6: Kiritilgan passwordni tekshirish
        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
        // STEP 7: Password notogri bo'lsa xato qaytarish
        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }
        // STEP 8: Toliq member malumotlarini olish
        return await this.memberModel.findById(member._id).exec();
    }
}



export default MemberService;
