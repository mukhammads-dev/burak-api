import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";

/** Member */
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
// credential checking
router.get("/member/detail", memberController.veryfyAuth);


/** Product */


/** Order */

export default router; 
