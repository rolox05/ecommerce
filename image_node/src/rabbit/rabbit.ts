"use strict";

import amqp = require("amqplib");
import * as env from "../server/environment";
const conf = env.getConfig(process.env);

interface IRabbitMessage {
    type: string;
    exchange: string;
    exchangeType: string;
    message: any;
}

let channel: amqp.Channel;

/**
 *
 * @api {topic} imagen/image-created Imagen Creada
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Mensajes image-created desde Imagen con el topic "image-created".
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

export async function sendImageCreated(imageId: string): Promise<IRabbitMessage> {
    return await sendMessage({
        type: "image-created",
        exchange: "image2",
        exchangeType: "topic",
        message: {
            date: new Date().valueOf(),
            imageId: imageId,
            action: "image-created"
        }
    });
}

async function sendMessage(message: IRabbitMessage): Promise<IRabbitMessage> {
    const channel = await getChannel();
    try {
        const exchange = await channel.assertExchange(message.exchange, message.exchangeType, { durable: false });
        if (channel.publish(
                exchange.exchange,
                (message.type ? message.type : ""),
                new Buffer(JSON.stringify(message)),
                {
                    expiration: 120000, // time for message living in the queue
                    persistent : false // persistent message to survive broker restart
                }
            )) {
            return Promise.resolve(message);
        } else {
            return Promise.reject(new Error("No se pudo encolar el mensaje"));
        }
    } catch (err) {
        console.log("RabbitMQ " + err);
        return Promise.reject(err);
    }
}

async function getChannel(): Promise<amqp.Channel> {
    if (!channel) {
        try {
            const conn = await amqp.connect(conf.rabbitUrl);
            channel = await conn.createChannel();
            console.log("RabbitMQ conectado");
            channel.on("close", function () {
                console.error("RabbitMQ Conexión cerrada");
                channel = undefined;
            });
        } catch (onReject) {
            console.error("RabbitMQ " + onReject.message);
            channel = undefined;
            return Promise.reject(onReject);
        }
    }
    if (channel) {
        return Promise.resolve(channel);
    } else {
        return Promise.reject(new Error("No channel available"));
    }
}

