"use strict";
/**
 * Servicios internos de Cart, normalmente son llamados por procesos Rabbit o background
 */

import { OrderAudit, IOrderAudit } from "./schema";

interface IOrderMessage {
    cartId: string;
    orderId: string;
    articles: IArticle[];
}

interface IArticle {
    articleId: string;
    quantity: number;
}

class OrderMessage implements IOrderMessage {
    cartId: string;
    orderId: string;
    articles: IArticle[];
}

class Article implements IArticle {
    articleId: string;
    quantity: number;
}

/**
 * Procesa una validación realizada a través de rabbit.
 */
export function orderCreateSaveAuditData(validation: IOrderMessage) {
    console.log("RabbitMQ Consume order Create : " + JSON.stringify(validation));
    const orderAuditRegistry = new OrderAudit(validation);
    orderAuditRegistry.save(function (err: any) {
        console.log(err);
    });
}