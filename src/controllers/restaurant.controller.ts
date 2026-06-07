import express, { Request, Response } from "express";
import { T } from "../libs/types/common"
import MemberService from "../models/Member.service";
import { LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
    try {
        console.log('goHome')
        res.send('Home Page');
        // send | json | redirect | end | render
    }
    catch (err) {
        console.log("Error, goHome:", err)
    }
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
        console.log('getLogin')
        res.send('Login Page');
    }
    catch (err) {
        console.log("Error, getLogin:", err)
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        console.log('getSignup')
        res.send('Signup Page');
    }
    catch (err) {
        console.log("Error, getSignup:", err)
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        console.log('getSignup')
        res.send('Signup Page');
    }
    catch (err) {
        console.log("Error, getSignup:", err)
    }
};

restaurantController.processLogin = async (req: Request, res: Response) => {
    try {
        console.log('processLogin')
        console.log("body:", req.body)
        const input: LoginInput = req.body;

        const memberService = new MemberService();
        const result = await memberService.processLogin(input);

        res.send(result)
    }
    catch (err) {
        console.log("Error, processLogin:", err)
        res.send(err);
    }
};



restaurantController.processSignup = async (req: Request, res: Response) => {
    try {
        console.log('processSignup')
        // STEP 1: req.body kelgan malumotni newMemberga tengladik
        const newMember: MemberInput = req.body;

        // STEP 2: New memberga restaurant type biriktirish
        newMember.memberType = MemberType.RESTAURANT;

        // STEP 3: Member service classdan object yasash
        const memberService = new MemberService();

        // STEP 4: Service object process method call va newMember argument resultga tenglash 
        const result = await memberService.processSignup(newMember);

        // STEP 13: Natijani browserga qaytarish
        res.send(result);
    }
    catch (err) {
        console.log("Error, processSignup:", err)
        // STEP : Xatoni ushlab browserga yuborish
        res.send(err)
    }
};


export default restaurantController;