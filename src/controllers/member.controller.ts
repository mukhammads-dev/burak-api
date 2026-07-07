import express, { Request, Response } from "express";
import { T } from "../libs/types/common"
import MemberService from "../models/Member.service";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode } from "../libs/Errors";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";
// for users  REACT project 
const memberService = new MemberService();
const memberController: T = {};
const authService = new AuthService();

memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log('signup')
        const input: MemberInput = req.body,
            result: Member = await memberService.signup(input),
            token = await authService.createToken(result);

        // accessToken nomi bilan brauzer cookie ichiga joylaymiz
        res.cookie("accessToken", token, {
            maxAge: AUTH_TIMER * 3600 * 1000,
            httpOnly: false //
        });

        res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
    }
    catch (err) {
        console.log("Error, signup:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

memberController.login = async (req: Request, res: Response) => {
    try {
        console.log('login')
        const input: LoginInput = req.body,
            result = await memberService.login(input),
            token = await authService.createToken(result)
        // accessToken nomi bilan brauzer cookie ichiga joylaymiz
        res.cookie("accessToken", token, {
            maxAge: AUTH_TIMER * 3600 * 1000,
            httpOnly: false //
        });

        res.status(HttpCode.OK).json({ member: result, accessToken: token });
    }
    catch (err) {
        // STEP 9
        console.log("Error, login:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);

    }
};

export default memberController;