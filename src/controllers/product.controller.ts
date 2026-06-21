import express, { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { AdminRequest } from "../libs/types/member";
import { threadCpuUsage } from "process";
import { ProductInput } from "../libs/types/product";

const productService = new ProductService();

const productController: T = {};

/** SPA=========== */

/** BSSR============ */

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log('getAllProducts')
        // STEP 1: Service ga uzatadi → DB dan barcha productlarni oladi
        const data = await productService.getAllProducts();
        // STEP 4: EJS templatega productlar arrayini yuboradi
        // products.ejs ichida {{ products }} → render bo'ladi
        res.render("products", { products: data }); // ejs ga qiymat yuborish
    }
    catch (err) {
        // STEP 5: Xato bo'lsa JSON formatda qaytaradi
        console.log("Error, getAllProducts:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log('createNewProduct')
        // STEP 4: Rasm yuklangan-yuklanmaganligini tekshiradi
        // req.files → multer STEP 2 da to'ldirgan
        if (!req.files?.length) // rasim 1 dan kop bolishi kerak bolmasa error
            throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED)
        //  ↑ fayl yo'q bo'lsa — to'xtatadi

        // STEP 5: Formdan kelgan matn ma'lumotlari
        // { productName, productPrice, productCollection, ... }
        const data: ProductInput = req.body

        // STEP 6: Rasm yo'llarini array ga aylantiradi
        // req.files = [{ path: "uploads\\products\\uuid.jpg" }, ...]
        data.productImages = req.files?.map(ele => {
            return ele.path.replace(/\\/g, "/");
        })
        // STEP 7: Service ga uzatadi → DB ga yozadi
        await productService.createNewProduct(data)
        // STEP 8: Muvaffaqiyatli → product/all sahifasiga qaytaradi
        res.send(
            `<script>alert ("${"Successfull creation"}"); window.location.replace('admin/product/all') </script>`);
    }
    catch (err) {
        console.log("Error, createNewProduct:", err)
        const message =
            err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(
            `<script>alert ("${message}"); window.location.replace('admin/product/all') </script>`);
    }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log('updateChosenProduct')

        const id = req.params.id as string;

        const result = await productService.updateChosenProduct(id, req.body);

        res.status(HttpCode.OK).json({ data: result })
    }
    catch (err) {
        console.log("Error, updateChosenProduct:", err)
        if (err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

export default productController