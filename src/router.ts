import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

/** Member */
router.get("/member/restaurant", memberController.getRestaurant);
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
    memberController.updateMember);

router.get("/member/top-users", memberController.getTopUsers);

/** Product */
router.get("/product/all", productController.getProducts); // check
router.get("/product/:id", // done
    memberController.retrieveAuth,
    productController.getProduct);
/** Order */
router.post("/order/create",
    memberController.veryfyAuth,
    orderController.createOrder); // check

router.get("/order/all",
    memberController.veryfyAuth,
    orderController.getMyOrders); // check

export default router; 
