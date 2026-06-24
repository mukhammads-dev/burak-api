import express, { Request, Response } from "express";
import { T } from "../libs/types/common"
import MemberService from "../models/Member.service";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors from "../libs/Errors";
// for users  REACT project 
const memberService = new MemberService();

const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
    try {
        console.log('signup')
        // STEP 1: 
        const input: MemberInput = req.body,
            // STEP 2:
            result: Member = await memberService.signup(input); //call
        // TODO: TOKENS AUTHENTICATION

        // STEP 7:
        res.json({ member: result });
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
        // STEP 1
        const input: LoginInput = req.body,

            //STEP 2
            result = await memberService.login(input);
        // TODO: TOKENS AUTHENTICATION
        // STEP 8
        res.json({ member: result });
    }
    catch (err) {
        // STEP 9
        console.log("Error, login:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);

    }
};

export default memberController;