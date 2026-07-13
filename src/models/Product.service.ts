import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { Product, ProductInput, ProductInquiry, ProductUpdateInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { ObjectId } from "mongoose"
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";


class ProductService {
    private readonly productModel;
    public viewService;

    constructor() {
        this.productModel = ProductModel;
        this.viewService = new ViewService();
    }

    /** SPA=========== */

    public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
        const match: T = { productStatus: ProductStatus.PROCESS };

        if (inquiry.productCollection)
            match.productCollection = inquiry.productCollection;

        if (inquiry.search) {
            match.productName = { $regex: new RegExp(inquiry.search, "i") };
        }

        const sort: T =
            inquiry.order === "productPrice"
                ? { [inquiry.order]: 1 } // prise: eng arzonidan yuqoriga
                : { [inquiry.order]: -1 }; // created at: eng ohirgi qoshilgandan pastga qarab

        const result = await this.productModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, // skip qil limitga qarab
                { $limit: inquiry.limit * 1 },  // skipdan keyingi page olib ber
            ])
            .exec();

        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }


    public async getProduct(
        memberId: ObjectId | null,
        id: string
    ): Promise<Product> {
        const productId = shapeIntoMongooseObjectId(id);

        let result = await this.productModel
            .findOne({
                _id: productId,
                productStatus: ProductStatus.PROCESS,
            })
            .exec();

        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        if (memberId) {
            // Check Existence
            const input: ViewInput = {
                memberId: memberId,
                viewRefId: productId,
                viewGroup: ViewGroup.PRODUCT,
            };

            const existView = await this.viewService.checkViewExistence(input);

            console.log("exist:", !!existView);

            if (!existView) {
                // Insert View
                await this.viewService.insertMemberView(input);

                // Increase Counts
                result = await this.productModel
                    .findByIdAndUpdate(
                        productId,
                        { $inc: { productViews: +1 } },
                        { new: true }
                    )
                    .exec();
            }
        }

        return result;
    }

    /** BSSR============ */
    public async getAllProducts(): Promise<Product[]> { // array ichida bir qator productlarni qaytarishi kerak
        // STEP 2: MongoDB dan BARCHA productlarni oladi (.find() = filter yo'q = hammasi)
        const result = await this.productModel.find().exec();
        // STEP 3: Hech narsa topilmasa xato
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND)

        return result;


    }

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {
            // STEP 7.1: MongoDB ga yangi product yozadi
            // input = { productName, productPrice, productImages: [...], ... }s
            return await this.productModel.create(input);
        } catch (err) {
            // STEP 7.2: Xato — masalan bir xil nom+size+volume bo'lsa (unique index)
            console.error("Error, model:createNewProduct:", err)
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async updateChosenProduct(
        id: string,
        input: ProductUpdateInput
    ): Promise<Product> {
        id = shapeIntoMongooseObjectId(id);  // string => ObjectId
        const result = await this.productModel.
            findOneAndUpdate(
                { _id: id }, // filter
                input,        // update qilayotkan malumot
                { new: true }) // yangilangandan KEYIN gi holatni qaytaradi
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED)

        return result;


    }

}


export default ProductService;