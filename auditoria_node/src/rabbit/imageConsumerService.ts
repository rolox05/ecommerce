
"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import { RabbitDirectConsumer } from "./tools/directConsumer";
import { RabbitDirectEmitter } from "./tools/directEmitter";
import { IRabbitMessage } from "./tools/common";
import { RabbitTopicConsumer } from "./tools/topicConsumer";
import * as validation from "../imageAudit/validation";
import { RabbitFanoutConsumer } from "./tools/fanoutConsumer";
import * as jwt from "jsonwebtoken";

interface IImageMessage {
    imageId: string;
    action: string;
    date: number;
}
class ImageMessage implements ImageMessage {
    imageId: string;
    action: string;
    date: number;
}


export function init() {
    const imagenCreate = new RabbitTopicConsumer("image-created", "image2", "image-created");
    imagenCreate.addProcessor("image-created", processImageCreatedMessage);
    imagenCreate.init();

}


/**
 *
 * @api {topic} imagen/image-created Imagen Creada
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes image-created desde Imagen con el topic "image-created".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "image-created",
 *     "message" : {
 *         "imagenid": "{imagenId}",
 *         “action”: “{action}”,
 *         "date": "{timeStamp}"
 *        }
 *     }
 */
function processImageCreatedMessage(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IImageMessage;
    message.action = "image-created";
    validation.imageCreateSaveAuditData(message);
}
