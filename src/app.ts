import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";

/** 1-ENTRANCE **/
const app = express(); // Expresni call qilib app object yasayapmiz
app.use(express.static(path.join(__dirname, "public"))); // Middleware DP => Public folder tashqi muxitga ochish
app.use(express.urlencoded({ extended: true })); // M DP => Traditional API support
app.use(express.json()); // M DP => Rest API support
app.use(morgan(MORGAN_FORMAT)); // M DP => logging support

/** 2-SESSIONS **/

/** 3-VIEWS **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // html quradigon engine EJS

/** 4-ROUTERS **/
app.use("/admin", routerAdmin);  // BSSR: EJS, Traditional FD = Adminka
app.use("/", router);            // SPA: REACT, user's app



export default app;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 