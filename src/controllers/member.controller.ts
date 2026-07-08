import express, { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common"
import MemberService from "../models/Member.service";
import { ExtendedRequest, LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
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

            // STEP : member ma'lumotidan JWT token yaratdi
            token = await authService.createToken(result);

        // accessToken nomi bilan brauzer cookie ichiga joylaymiz
        res.cookie("accessToken", token, {
            maxAge: AUTH_TIMER * 3600 * 1000,
            httpOnly: false //
        });
        // STEP 5: JSON qaytaradi — member va token ikkalasini
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
            maxAge: AUTH_TIMER * 3600 * 1000, // time for cookie
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

memberController.logout = (req: ExtendedRequest, res: Response) => {
    try {
        console.log("logout");
        res.cookie("accessToken", null, { maxAge: 0, httpOnly: true })
        res.status(HttpCode.OK).json({ logout: true });
    } catch (err) {
        console.log("Error, login:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}







// credential checking strict 
memberController.veryfyAuth = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    let member = null; // token mavjud bolsa ozgartiramiz
    try {
        // STEP 1: cookie dan tokenni oladi
        const token = req.cookies["accessToken"]; // token mavjudmi checking
        // STEP 2: token bor bo'lsa → checkAuth ga uzatadi
        if (token) req.member = await authService.checkAuth(token);
        if (!req.member)
            throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
        next()

    } catch (err) {
        console.log("Error, veryfyAuth:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
    }

};



memberController.retrieveAuth = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies["accessToken"];
        if (token) req.member = await authService.checkAuth(token);
        // STEP 2: member nomi bilan req ichiga joylab bersin mantigni

        next()
    } catch (err) {
        console.log("Error, veryfyAuth:", err)
        next()
    }

};




export default memberController;