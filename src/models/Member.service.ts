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

    // Define
    public async processSignup(input: MemberInput): Promise<Member> {
        // STEP 6: Restaurant owner mavjudligini tekshirish
        const exist = await this.memberModel
            .findOne({ memberType: MemberType.RESTAURANT })
            .exec();
        // STEP 7: Mavjud bo'lsa signupni to'xtatish
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


    // Define
    public async processLogin(input: LoginInput): Promise<Member> {
        const member = await this.memberModel
            .findOne(
                { memberNick: input.memberNick },
                { memberNick: 1, memberPassword: 1 }
            )
            .exec();

        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
        //  const isMatch = input.memberPassword === member.memberPassword;

        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        return await this.memberModel.findById(member._id).exec();
    }
}



export default MemberService;
