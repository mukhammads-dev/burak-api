import path from "path";  // fayl nomidan extension (.jpg, .png) olish uchun
import multer from "multer";   // fayl/rasm yuklash uchun Express middleware yukladik
import { v4 } from "uuid"; // / har bir faylga noyob (unique) nom berish uchun random string


/** MULTER IMAGE UPLOADER har hil targetlar uchun */

function getTargetImageStorage(address: any) {
    // QAYERGA saqlash — destination
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./uploads/${address}`);
        },
        // QANDAY NOM bilan saqlash — filename
        filename: function (req, file, cb) {
            const extension = path.parse(file.originalname).ext;
            const random_name = v4() + extension;
            cb(null, random_name);
        },
    });


}

// Bu function har hil targetlar uchun upload mantigini hosil qilib beradi   
const makeUploader = (address: string) => { // "address" parametrini oladi — qaysi papkaga saqlanishini bildiradi
    const storage = getTargetImageStorage(address);
    return multer({ storage: storage }); // adress => makeUploader("products").array("productImages", 5), 
};

export default makeUploader; // makeUploader nom bilan default export qilayapmiz buni router-adminda ishlatamiz 











/*
// Multer storage = yani mahsulotlar/tovarlarni yuklash uchun storage - Lekin bu umumiy holat uchun emas ekan

const product_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/products");            // manzil yani uploads/products folderga yuklaysan deyapmiz
    },
    filename: function (req, file, cb) {
        console.log(file);  // yuklanayotgan fileni parametrlarin log qilamzi
        const extension = path.parse(file.originalname).ext;   // path.parse qilib yuklangan file formatin oladi JPG .ext methodi orqali
        const random_name = v4() + extension; // v4 RANDOM string + extension(JPG) nomi random_name 
        cb(null, random_name);

    },
});

export const uploadProductImage = multer({ storage: product_storage }); // routerda ishlatish uchun export qilayapmiz

*/