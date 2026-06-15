import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";

/** Restaurant */
routerAdmin.get('/', restaurantController.goHome);
routerAdmin
    .get('/login', restaurantController.getLogin)
    .post('/login', restaurantController.processLogin);
routerAdmin
    .get('/signup', restaurantController.getSignup)
    .post('/signup', restaurantController.processSignup)
routerAdmin.get('/logout', restaurantController.logout)
routerAdmin.get('/check-me', restaurantController.checkAuthSession)

/** Product */
routerAdmin.get(
    '/product/all',
    restaurantController.veryfyRestaurant, // MD oraliq mantiq
    productController.getAllProducts
);
routerAdmin.post(
    '/product/create',
    restaurantController.veryfyRestaurant,
    productController.createNewProduct)
routerAdmin.post(
    '/product/:id',
    restaurantController.veryfyRestaurant,
    productController.updateChosenProduct)

/** User */

export default routerAdmin;