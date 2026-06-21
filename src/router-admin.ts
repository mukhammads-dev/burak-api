import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";

/** Restaurant */
routerAdmin.get('/', restaurantController.goHome);
routerAdmin
    .get('/login', restaurantController.getLogin)
    .post('/login', restaurantController.processLogin);
routerAdmin
    .get('/signup', restaurantController.getSignup)
    .post('/signup',
        makeUploader("members").single("memberImage"),  // Multer birinchi file yuklab beradi
        restaurantController.processSignup);
routerAdmin.get('/logout', restaurantController.logout)
routerAdmin.get('/check-me', restaurantController.checkAuthSession);

/** Product */
routerAdmin.get(
    '/product/all',
    restaurantController.veryfyRestaurant,
    productController.getAllProducts
);
routerAdmin.post(
    '/product/create',
    restaurantController.veryfyRestaurant,
    makeUploader("products").array("productImages", 5),  // rasm yuklaydi
    productController.createNewProduct
);
routerAdmin.post(
    '/product/:id',
    restaurantController.veryfyRestaurant,
    productController.updateChosenProduct
);

/** User */
routerAdmin.get(
    "/user/all",
    restaurantController.veryfyRestaurant,
    restaurantController.getUsers)
routerAdmin.post(
    "/user/edit",
    restaurantController.veryfyRestaurant,
    restaurantController.updateChosenUser)

export default routerAdmin;