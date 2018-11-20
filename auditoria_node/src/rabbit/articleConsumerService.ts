"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import { RabbitDirectConsumer } from "./tools/directConsumer";
import { RabbitDirectEmitter } from "./tools/directEmitter";
import { IRabbitMessage } from "./tools/common";
import { RabbitTopicConsumer } from "./tools/topicConsumer";
import * as validation from "../articleAudit/validation";
import { RabbitFanoutConsumer } from "./tools/fanoutConsumer";
import * as jwt from "jsonwebtoken";

interface IArticleMessage {
    userId: string;
    orderId?: string;
    userName: string;
    action: string;
    articleId: string;
    articleName: string;
    date: number;
    quantity?: number;
    articleData: IArticleData;
    message: IArticleAction;
}
class ArticleMessage implements IArticleMessage {
    userId: string;
    orderId?: string;
    userName: string;
    action: string;
    articleId: string;
    articleName: string;
    date: number;
    quantity?: number;
    articleData: IArticleData;
    message: IArticleAction;
}

class ArticleAction implements IArticleAction {
    article: string;
    action: string;
}

interface IArticleAction {
    article: string;
    action: string;
}

interface IArticleData {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    enabled: Boolean;
    quantity: number;
    orderId: string;
}

class ArticleData implements IArticleData {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    enabled: Boolean;
    quantity: number;
    orderId: string;
}

export function init() {
    const articleCreate = new RabbitTopicConsumer("article-created", "catalog2", "article-created");
    articleCreate.addProcessor("article-created", processArticleCreatedMessage);
    articleCreate.init();

    const articleEdit = new RabbitTopicConsumer("article-edited", "catalog2", "article-edited");
    articleEdit.addProcessor("article-edited", processArticleEditedMessage);
    articleEdit.init();

    const articleDelete = new RabbitTopicConsumer("article-deleted", "catalog2", "article-deleted");
    articleDelete.addProcessor("article-deleted", processArticleDeletedMessage);
    articleDelete.init();

    const articleBougth = new RabbitTopicConsumer("article-bought", "catalog2", "article-bought");
    articleBougth.addProcessor("article-bought", processArticleBoughtMessage);
    articleBougth.init();
}

/**
 *
 * @api {topic} catalog/article-created Artículo Creado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes article-created desde Catalog con el topic "article-created".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "article-created",
 *     "message" : {
 *         "userId": string,
 *         "userName": string,
 *         "articleId": "{articleId}",
 *         “articleName”: “{articleName}”,
 *         "date": "{timeStamp}",
 *         "articleData": {
 *                "name": String,
 *                "description": String,
 *                "price": Float,
 *                "stock": Integer,
 *                "enabled": Boolean
 *          }
 *        }
 *     }
 */
function processArticleCreatedMessage(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IArticleMessage;
    message.action = "article-created";
    if (message.articleData) {
        const data = JSON.parse(String(message.articleData));
        const art = new ArticleData();
        art.id = data["_id"];
        art.name = data["name"];
        art.description = data["description"];
        art.price = data["price"];
        art.stock = data["stock"];
        art.enabled = data["enabled"];
        art.quantity = data["quantity"];
        art.orderId = data["orderId"];
        message.articleData =  art;
    }
    validation.articleSaveAuditData(message);
}


/**
 *
 * @api {topic} catalog/article-edited Artículo Editado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes article-edited desde Catalog con el topic "article-edited".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "article-edited",
 *     "message" : {
 *         "userId": string, (agregado)
 *         "userName": string, (agregado)
 *         "articleId": "{articleId}",
 *         “articleName”: “{articleName}”,
 *         "date": "{timeStamp}",
 *         "articleData": {
 *                "name": String,
 *                "description": String,
 *                "image": String, (deprecado, no está en el servicio catalog)
 *                "price": Float,
 *                "stock": Integer,
 *                "updated": datetime, (deprecado, no está en el servicio catalog)
 *                "created": datetime, (deprecado, no está en el servicio catalog)
 *                "enabled": Boolean
 *          }
 *        }
 *     }
 */
function processArticleEditedMessage(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IArticleMessage;
    message.action = "article-edited";
    if (message.articleData) {
        const data = JSON.parse(String(message.articleData));
        const art = new ArticleData();
        art.id = data["_id"];
        art.name = data["name"];
        art.description = data["description"];
        art.price = data["price"];
        art.stock = data["stock"];
        art.enabled = data["enabled"];
        art.quantity = data["quantity"];
        art.orderId = data["orderId"];
        message.articleData =  art;
    }
    validation.articleSaveAuditData(message);
}

/**
 *
 * @api {topic} catalog/article-deleted Artículo Borrado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes article-deleted desde Catalog con el topic "article-deleted".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "article-deleted",
 *     "message" : {
 *         "userId": string,
 *         "userName": string,
 *         "articleId": "{articleId}",
 *         “articleName”: “{articleName}”,
 *         "date": "{timeStamp}",
 *         "articleData": {
 *                "name": String,
 *                "description": String,
 *                "price": Float,
 *                "stock": Integer,
 *                "enabled": Boolean
 *          }
 *        }
 */
function processArticleDeletedMessage(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IArticleMessage;
    message.action = "article-deleted";
    if (message.articleData) {
        const data = JSON.parse(String(message.articleData));
        const art = new ArticleData();
        art.id = data["_id"];
        art.name = data["name"];
        art.description = data["description"];
        art.price = data["price"];
        art.stock = data["stock"];
        art.enabled = data["enabled"];
        art.quantity = data["quantity"];
        art.orderId = data["orderId"];
        message.articleData =  art;
    }
    validation.articleSaveAuditData(message);
}

/**
 *
 * @api {topic} catalog/article-bought Artículo Comprado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes article-bought desde Catalog con el topic "article-bought".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "article-bought",
 *     "message" : {
 *         "articleId": "{articleId}",
 *         "date": "{timeStamp}",
 *         "articleData": {
 * 	          "id": String,
 *            "price": Float,
 *            "stock": Integer,
 *            "enabled": Boolean,
 *      	  "orderId": "{orderId}",
 *            "quantity": "{int}"
 *          }
 *        }
 *     }
 */
function processArticleBoughtMessage(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IArticleMessage;
    message.action = "article-bought";
    if (message.articleData) {
        const data = JSON.parse(String(message.articleData));
        const art = new ArticleData();
        art.id = data["articleId"];
        art.price = data["price"];
        art.stock = data["stock"];
        art.quantity = data["quantity"];
        art.orderId = data["referenceId"];
        message.articleData =  art;
    }
    validation.articleSaveAuditData(message);
}