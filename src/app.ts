import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";

// TCP 2 sessionlar uchun storage yasadik
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
const MongoDBStore = ConnectMongoDB(session) // ConnectMongoDB ga sessiondi arg sifatida pass qilsak class beradi 
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL), // MongoDB url uladik 
    collection: 'sessions' // collectionda sessions MongoDB da saqlanadi 
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
        saveUninitialized: true // login bolmasaham saqlanadi sid databasega statistika uchun
    })
)
// req.+session endi Tamga bor

// Middleware for brauzer local variables to use at EJS 
app.use(function (req, res, next) {
    const sessionInstance = req.session as T; // req sessiondi constanta sessionInstance ga tengladik
    res.locals.member = sessionInstance.member; // res.locals.member nomi bilan sessionInstance ichidan kelayotkan memberdi beramiz
    next();

})

/** 3-VIEWS **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/** 4-ROUTERS **/
app.use("/admin", routerAdmin);
app.use("/", router);



export default app;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 