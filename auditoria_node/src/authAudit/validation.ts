"use strict";
/**
 * Servicios internos de Cart, normalmente son llamados por procesos Rabbit o background
 */

import { IUserAudit, UserAudit } from "./schema";

interface IUserCreateMessage {
    userId: string;
    date: number;
    userData?: IUserData;
    message?: IUserAction;
}

interface IUserAction {
    user: string;
    action: string;
}

interface IUserData {
    name: string;
    login: string;
    permissions: string[];
    updated: Date;
    created: Date;
    enabled: Boolean;
}
/**
 * Procesa una validación realizada a través de rabbit.
 * Si un articulo no es valido se elimina del cart.
 */
export function userCreateSaveAuditData(validation: IUserCreateMessage) {
    console.log("RabbitMQ Consume User Create : " + JSON.stringify(validation));
    const userAuditRegistry = new UserAudit(validation);
    userAuditRegistry.save(function (err: any) {
        console.log(err);
    });
}