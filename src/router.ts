import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";

/** Member */
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post("/member/logout",
    memberController.veryfyAuth,
    memberController.logout);
router.get("/member/detail",
    memberController.veryfyAuth,
    memberController.getMemberDetail);

router.post("/member/update",
    memberController.veryfyAuth,
    uploader("members").single("memberImage"), // uploads members filega memberImage nomi bilan saqlashini korsatdik
    memberController.updateMember
);



/** Product */


/** Order */

export default router; 
