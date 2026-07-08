import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";

/** Member */
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post("/member/logout",
    memberController.veryfyAuth,
    memberController.logout);
// credential checking
router.get("/member/detail",
    memberController.veryfyAuth,
    memberController.getMemberDetail);


/** Product */


/** Order */

export default router; 
