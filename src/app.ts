import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";

// TCP 2 sessionlar uchun storage yasadik
import session from "express-session"; // express sess dan session qabul qildik
import ConnectMongoDB from "connect-mongodb-session"; // session packagedan mongodb qabul qildik
const MongoDBStore = ConnectMongoDB(session) // ikita sessiondan class yaratdik
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL), // MongoDB url uladik 
    collection: 'sessions' // sessions MongoDB da saqlanadi
});


/** 1-ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/
// req.+session > Kirib kelganda tamga yoq edi 
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),  // code for creating sessions.. secret.env
        cookie: {
            maxAge: 1000 * 3600 * 3, // session time 3h
        },
        store: store,   // ← MongoDB "sessions" collectioniga yozadi

        resave: true,   // Har so'rovda yangilanadi (vaqt uzayadi)
        saveUninitialized: true // login bolmasaham saqlanadi sid database
    })
)
// req.+session endi Tamga bor

/** 3-VIEWS **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/** 4-ROUTERS **/
app.use("/admin", routerAdmin);
app.use("/", router);



export default app;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 