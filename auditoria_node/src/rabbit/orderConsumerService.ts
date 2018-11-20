
"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import { RabbitDirectConsumer } from "./tools/directConsumer";
import { RabbitDirectEmitter } from "./tools/directEmitter";
import { IRabbitMessage } from "./tools/common";
import { RabbitTopicConsumer } from "./tools/topicConsumer";
import * as validation from "../orderAudit/validation";
import { RabbitFanoutConsumer } from "./tools/fanoutConsumer";
import * as jwt from "jsonwebtoken";

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


export function init() {
    const orderCreate = new RabbitTopicConsumer("order_audit", "sell_flow", "order_placed");
    orderCreate.addProcessor("order_placed", processOrderCreatedMessage);
    orderCreate.init();

    const orderPaymentAdded = new RabbitTopicConsumer("order_pay_audit", "sell_flow", "order_payment");
    orderPaymentAdded.addProcessor("order_payment", processOrderPaymentAddedMessage);
    orderPaymentAdded.init();

}

/**
 *
 * @api {topic} order/order-placed Orden Creada
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes order-placed desde Orden con el topic "order-placed".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "order-placed",
 *     "message" : {
 *         "orderId": "{orderId}",
 *         “cartId”: “{cartId}”,
 *         "date": "{timeStamp}",
 *         "articles": [{
 *            articleId: String
 *            quantity: Number,
 *          }]
 *        }
 *     }
 */
function processOrderCreatedMessage(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IOrderMessage;

    console.log("recibi orden ROLO");

    console.log(message);

    validation.orderCreateSaveAuditData(message);
}

 /**
  *
  * @api {topic} order/order-payment Pago agregado a Orden
  *
  * @apiGroup RabbitMQ
  *
  * @apiDescription Consume mensajes order-payment desde Order con el topic "order_payment".
  *
  * @apiSuccessExample {json} Mensaje
  *     {
  *     "type": "order-payment",
  *     "message" : {
  *         "userId": "{userId}",
  *         "orderId": "{orderId}",
  *         "method": "{paymentMethod}",
  *         "amount": "{amount}",
  *        }
  *     }
  *
  */
function processOrderPaymentAddedMessage(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IOrderMessage;

    console.log("recibi orden de pago ROLO");

    console.log(message);

    validation.orderCreateSaveAuditData(message);
}