"use strict";

import { MongoError } from "mongodb";
import * as mongoose from "mongoose";
import * as env from "./server/environment";
import { Config } from "./server/environment";
import * as express from "./server/express";

import * as userAuditService from "./rabbit/authConsumerServices";
import * as articleAuditService from "./rabbit/articleConsumerService";
import * as imageAuditService from "./rabbit/imageConsumerService";
import * as orderAuditService from "./rabbit/orderConsumerService";

// Variables de entorno
const conf: Config = env.getConfig(process.env);

// Mejoramos el log de las promesas
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});

// Establecemos conexión con MongoDD
mongoose.connect(conf.mongoDb, {}, function (err: MongoError) {
  if (err) {
    console.error("No se pudo conectar a MongoDB!");
    console.error(err.message);
    process.exit();
  } else {
    console.log("MongoDB conectado.");
  }
});

// Se configura e inicia express
const app = express.init(conf);

// Iniciar todos los subscriptores
userAuditService.init();
articleAuditService.init();
imageAuditService.init();
orderAuditService.init();

app.listen(conf.port, () => {
  console.log(`Audit Server escuchando en puerto ${conf.port}`);
});

module.exports = app;
