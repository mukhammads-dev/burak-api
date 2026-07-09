import MemberModel from "../schema/Member.model";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import { error } from "console";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";



class MemberService {
    private readonly memberModel;

    constructor() {
        //  Model bilan bog'lanish
        this.memberModel = MemberModel;
    }

    /** SPA=========== */
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
            .findOne(
                // Find qilsin: Nick, kiribkelgan Nick va Status Delete bomagan bolsa login boladi
                { memberNick: input.memberNick, memberStatus: { $ne: MemberStatus.DELETE } },
                { memberNick: 1, memberPassword: 1, memberStatus: 1 }
            )
            .exec();
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
        else if (member.memberStatus === MemberStatus.BLOCK) {
            throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER)
        }

        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);

        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }

        return await this.memberModel.findById(member._id).lean().exec(); // lean => only data 
    }

    public async getMemberDetail(member: Member): Promise<Member> {
        const memeberId = shapeIntoMongooseObjectId(member._id);
        const result = await this.memberModel
            .findOne({ _id: memeberId, memberStatus: MemberStatus.ACTIVE })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND)
        return result
    }

    public async updateMember(member: Member, input: MemberUpdateInput): Promise<Member> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const result = await this.memberModel
            .findOneAndUpdate({ _id: memberId }, input, { new: true }) // filter, update, yangilangan versiyasi
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

        return result;

    }





    /** BSSR============ */
    public async processSignup(input: MemberInput): Promise<Member> {
        //STEP 4: Restaurant owner mavjudligini tekshirish
        const exist = await this.memberModel
            .findOne({ memberType: MemberType.RESTAURANT })
            .exec();
        //STEP 5: Mavjud bo'lsa signupni to'xtatish
        if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

        // STEP 6: Paroldan salt (tasodifiy belgilar) yaratadi
        const salt = await bcrypt.genSalt();
        // STEP 7: Parolni hash ga aylantiradi
        input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

        try {
            // STEP 8: Yangi memberni databasega saqlash
            const result = await this.memberModel.create(input);
            // STEP 9: Passwordni delete holda qaytarish
            result.memberPassword = "";
            // STEP 10: Natijani Controllerga qaytarish
            return result;
        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async processLogin(input: LoginInput): Promise<Member> {
        // STEP 3: DB dan faqat nick va password ni qidiradi
        const member = await this.memberModel
            .findOne(
                { memberNick: input.memberNick, memberType: MemberType.RESTAURANT },
                { memberNick: 1, memberPassword: 1 }
            )
            .exec();
        // STEP 4: Member topilmasa Error
        if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

        // STEP 5: parol to'g'rimi?
        const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
        // STEP 6: noto'g'ri bo'lsa Error
        if (!isMatch) {
            throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
        }
        // STEP 7: hammasi to'g'ri → to'liq memberni qaytaradi
        return await this.memberModel.findById(member._id).exec();
    }

    public async getUsers(): Promise<Member[]> {
        const result = await this.memberModel
            .find({ memberType: MemberType.USER })
            .exec()

        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;

    }

    public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
        input._id = shapeIntoMongooseObjectId(input._id);
        const result = await this.memberModel
            .findByIdAndUpdate({ _id: input._id }, input, { new: true })
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

        return result;

    }

}



export default MemberService;
