import express, { NextFunction, Request, Response } from "express";
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
        console.log("=====")
        res.redirect("/admin");
    }
};

restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log('processSignup')
        // STEP 1: 
        const newMember: MemberInput = req.body;

        // STEP 2: Restaurant enamdi new memberga biriktiryapmiz
        newMember.memberType = MemberType.RESTAURANT;

        // STEP 3:
        const result = await memberService.processSignup(newMember);

        // STEP 10: AUTH 
        req.session.member = result; // bu yerda frontend cookien ichiga seed ni joylab keladi
        // STEP 11: AUTH — MongoDB "sessions" collectioniga saqlaydi, keyin response yuboradi
        req.session.save(function () {
            res.send(result); // ← browser Set-Cookie: connect.sid=xxx oladi
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

        const input: LoginInput = req.body;
        const result = await memberService.processLogin(input);

        req.session.member = result; // browser cookie (sid) save
        req.session.save(function () { // DB.session + member save
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
            // ← DB ga qaytib bormaydi! Cookie → session → memory dan tekshiradi
            res.send(`<script>alert("${req.session.member.memberNick}")</script>`)
        else res.send(`<script>alert("${Message.NOT_AUTHENTICATED}")</script>`);

    }
    catch (err) {
        console.log("Error, checkAuthSession:", err)
        res.send(err);
    }
};

restaurantController.veryfyRestaurant = (
    req: AdminRequest,
    res: Response,
    next: NextFunction
) => {
    // req.session icidan member check qilamiz typeRestaurant bolsh shart
    if (req.session?.member?.memberType === MemberType.RESTAURANT) {
        req.member = req.session.member; // type checking
        next();
    } else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(
            `<script>alert("${message}"); window.location.replace('/admin/login);</script>`
        );
    }
};

export default restaurantController;



