"use strict";

import { Express } from "express";
import { Config } from "./utils/environment";
import * as expressApp from "./utils/express.factory";
import * as appConfig from "./utils/environment";
import * as chalk from "chalk";

// Variables de entorno
const conf: Config = appConfig.getConfig(process.env);

// Se configura e inicializa express
const app = expressApp.init(conf);

app.listen(conf.port, () => {
  console.log(chalk.default.green(`Image Server escuchando en puerto ${conf.port}`));
});

module.exports = app;
