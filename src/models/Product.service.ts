import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput, ProductUpdateInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";


class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = ProductModel;
    }

    /** SPA=========== */
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