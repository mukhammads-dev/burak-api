import OrderItemModel from "../schema/OrderItem.model";
import OrderModel from "../schema/Order.model";
import { Member } from "../libs/types/member";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ObjectId } from "mongoose";
import MemberService from "./Member.service";
import { OrderStatus } from "../libs/enums/order.enum";

class OrderService {
    private readonly orderModel;
    private readonly orderItemModel;
    private readonly memberService;

    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
        this.memberService = new MemberService();
    }

    public async createOrder(
        member: Member,
        input: OrderItemInput[]
    ): Promise<Order> {
        const memberId = shapeIntoMongooseObjectId(member._id);

        const amount = input.reduce( //  jami narx
            (accumulator: number, item: OrderItemInput) => {
                return accumulator + item.itemPrice * item.itemQuantity;
                // item 1: itemPrice=15 × itemQuantity=2 = 30
            },
            0
        );

        const delivery = amount < 100 ? 5 : 0;

        try { // orders collection ga yozish
            const newOrder: Order = await this.orderModel.create({
                orderTotal: amount + delivery,
                orderDelivery: delivery,
                memberId: memberId,
                // orderStatus → "PAUSE" (default, schema dan)
            });

            const orderId = newOrder._id; // yaratilgan order ID sini saqlab qo'ydi
            // "order1" ← bu keyingi qadamda kerak
            console.log("orderId:", orderId);

            await this.recordOrderItem(orderId, input); //  har mahsulotni saqlash
            // orderId = "order1" (yuqorida yaratilgan)
            // input   = [ {Lavash x2}, {Kebab x1} ]

            return newOrder;
        } catch (err) {
            console.log("Error, model:createOrder:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    private async recordOrderItem( // har mahsulotni saqlash
        orderId: ObjectId,
        input: OrderItemInput[]
    ): Promise<void> {
        const promisedList = input.map(async (item: OrderItemInput) => {
            item.orderId = orderId; // "order1" ga bog'ladi
            // Lavash ga: orderId = "order1" ← bog'liq
            // Kebab ga:  orderId = "order1" ← bog'liq
            item.productId = shapeIntoMongooseObjectId(item.productId);
            // "prod1" → ObjectId("prod1")


            await this.orderItemModel.create(item);

            return "INSERTED";
        });

        const orderItemState = await Promise.all(promisedList);
        console.log("orderItemState:", orderItemState);
        // BARCHA mahsulotlar BIR VAQTDA saqlanadi (parallel)
        // orderItemState = ["INSERTED", "INSERTED"]
    }


    public async getMyOrders(
        member: Member,
        inquiry: OrderInquiry
    ): Promise<Order[]> {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const matches = { // filter ucun
            memberId: memberId, // faqat SHU userning buyurtmalari
            orderStatus: inquiry.orderStatus // faqat "PAUSE" statuslilar
        };

        const result = await this.orderModel
            .aggregate([
                { $match: matches },
                { $skip: (inquiry.page - 1) * inquiry.limit },
                // page=1: (1-1)*5 = 0 → 0 ta o'tkazib yubor
                // page=2: (2-1)*5 = 5 → 5 ta o'tkazib yubor
                { $sort: { updatedAt: -1 } },
                { $limit: inquiry.limit },
                {
                    // orderItems bilan birlashtirish
                    $lookup: {
                        from: "orderItems", // qaysi collectiondan qidirsin
                        localField: "_id",  // HOZIR ishlab turgan collection dagi id
                        foreignField: "orderId",   // FROM da ko'rsatilgan collection dagi id
                        as: "orderItems",         // natija qaysi nomda kelsin
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "orderItems.productId",
                        foreignField: "_id",
                        as: "productData",
                    },
                }
            ])
            .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        return result;
    }

    public async updateOrder(
        member: Member,
        input: OrderUpdateInput
    ): Promise<Order> {
        const memberId = shapeIntoMongooseObjectId(member._id),
            orderId = shapeIntoMongooseObjectId(input.orderId),
            orderStatus = input.orderStatus;

        const result = await this.orderModel
            .findOneAndUpdate(
                {
                    memberId: memberId, // ← shu memberni buyurtmasi filter
                    _id: orderId,       // ← shu ID li buyurtma
                },
                { orderStatus: orderStatus }, // ← yangi status update
                { new: true }                  // ← yangilangan holatni qaytaradi option
            )
            .exec();

        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        // STEP 7: PROCESS ga o'tkazilsa — point beriladi!
        if (orderStatus === OrderStatus.PROCESS) {
            await this.memberService.addUserPoint(member, 1);
        }
        return result;
    }
}



export default OrderService;