import express, { Request, Response } from "express";
import { T } from "../libs/types/common"
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { Message } from "../libs/Errors";

const memberService = new MemberService();
const restaurantController: T = {};

restaurantController.goHome = (req: Request, res: Response) => {
    try {
        console.log('goHome')
        res.render("home");
        // send | json | redirect | end | render
    }
    catch (err) {
        console.log("Error, goHome:", err)
        res.redirect("/admin");
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        console.log('getSignup')
        res.render("signup");
    }
    catch (err) {
        console.log("Error, getSignup:", err)
        res.redirect("/admin");
    }
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
        console.log('getLogin')
        res.render("login");
    }
    catch (err) {
        console.log("Error, getLogin:", err);
        res.redirect("/admin");
    }
};

restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log('processSignup')
        // STEP 1: req.body kelgan malumotni newMemberga tengladik
        const newMember: MemberInput = req.body;

        // STEP 2: New memberga restaurant type biriktirish
        newMember.memberType = MemberType.RESTAURANT;

        // STEP 4: Service object process method call va newMember argument resultga tenglash 
        const result = await memberService.processSignup(newMember);

        // AUTH — SESSION GA SAQLASH
        req.session.member = result;  // Sessiyaga member ma'lumotini yoz
        req.session.save(function () {
            res.send(result);
        });

    }
    catch (err) {
        console.log("Error, processSignup:", err)
        const message =
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script>alert ("${message}"); window.location.replace('admin/signup') </script>`);

    }
};

restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log('processLogin')
        console.log("body:", req.body)
        // STEP 1: req.body kelgan malumotni inputga tengladik
        const input: LoginInput = req.body;

        // STEP 3: memberService object process method call va input argument resultga tenglash 
        const result = await memberService.processLogin(input);

        // AUTH
        req.session.member = result;
        req.session.save(function () {
            res.send(result);
        });
    }
    catch (err) {
        console.log("Error, processLogin:", err);
        const message =
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script>alert ("${message}"); window.location.replace('admin/login') </script>`);
    }
};

restaurantController.logout = async (req: AdminRequest, res: Response) => {
    try {
        console.log('logout')
        req.session.destroy(function () {
            res.redirect("/admin")
        });
    }
    catch (err) {
        console.log("Error, logout:", err)
        res.redirect("/admin")
    }
};


restaurantController.checkAuthSession = async (req: AdminRequest, res: Response) => {
    try {
        console.log('checkAuthSession')
        if (req.session?.member)
            res.send(`<script>alert("${req.session.member.memberNick}")</script>`)
        else res.send(`<script>alert("${Message.NOT_AUTHENTICATED}")</script>`);

    }
    catch (err) {
        console.log("Error, checkAuthSession:", err)
        res.send(err);
    }
};


export default restaurantController;



