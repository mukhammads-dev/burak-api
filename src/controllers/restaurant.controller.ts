import express, { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common"
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
// for BSSR admin project
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
        res.redirect("/admin");
    }
};

restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log('processSignup')
        const file = req.file; // uploads.file ushlab oldik
        if (!file) throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG); // rest-user image kiritishi shart bolmasa error

        const newMember: MemberInput = req.body;
        newMember.memberImage = file?.path.replace(/\\/g, "/"); // fille-imageni member-imagega joyladik
        newMember.memberType = MemberType.RESTAURANT;
        const result = await memberService.processSignup(newMember);

        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        });

    }
    catch (err) {
        console.log("Error, processSignup:", err)
        const message =
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script>alert ("${message}"); window.location.replace('/admin/signup') </script>`);

    }
};

restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log('processLogin')

        const input: LoginInput = req.body;
        const result = await memberService.processLogin(input);

        req.session.member = result; // browser cookie (sid) save
        req.session.save(function () { // DB.session + member save
            res.redirect("/admin/product/all");
        });
    }
    catch (err) {
        console.log("Error, processLogin:", err);
        const message =
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script>alert ("${message}"); window.location.replace('/admin/login') </script>`);
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
// done
restaurantController.getUsers = async (req: Request, res: Response) => {
    try {
        console.log('getUsers')
        const result = await memberService.getUsers();
        console.log("result:", result)

        res.render("users", { users: result });
    }
    catch (err) {
        console.log("Error, getUsers:", err);
        res.redirect("/admin/login");
    }
};
// done Rest API 
restaurantController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        console.log('updateChosenUser')
        const result = await memberService.updateChosenUser(req.body);

        res.status(HttpCode.OK).json({ data: result });
    }
    catch (err) {
        console.log("Error, signup:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
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
// done
restaurantController.veryfyRestaurant = (
    req: AdminRequest,
    res: Response,
    next: NextFunction
) => {
    // req.session icidan member check qilamiz typeRestaurant bolsh shart
    if (req.session?.member?.memberType === MemberType.RESTAURANT) {
        req.member = req.session.member; // type checking
        next(); // Md uchun next qoyilishi shart ekan keyingi process ga otadi
    } else {
        const message = Message.NOT_AUTHENTICATED;
        res.send(
            `<script>alert("${message}"); window.location.replace('/admin/login);</script>`
        );
    }
};

export default restaurantController;



