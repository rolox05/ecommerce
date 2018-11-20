"use strict";

import amqp = require("amqplib");
import * as env from "../server/environment";
import { IUser } from "../user/user";
const conf = env.getConfig(process.env);

interface IRabbitMessage {
    type: string;
    exchange: string;
    exchangeType: string;
    message: any;
}

let channel: amqp.Channel;

/**
 * @api {fanout} auth/fanout Invalidar Token
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription AuthService enviá un broadcast a todos los usuarios cuando un token ha sido invalidado. Los clientes deben eliminar de sus caches las sesiones invalidadas.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "logout",
 *        "message": "{Token revocado}"
 *     }
 */
export async function sendLogout(token: string): Promise<IRabbitMessage> {
    return await sendMessage({
        type: "logout", // "logout",
        exchange: "auth",
        exchangeType: "fanout",
        message: token
    });
}

/**
 *
 * @api {topic} auth/user-created Usuario Creado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Envía mensajes user-created.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "user-created",
 *     "message" : {
 *         "userId": "{userId}",
 *         "date": "{timeStamp}",
 *         "userData": {
 *             name: string,
 *             login: string,
 *             permissions: string[],
 *             updated: Date,
 *             created: Date,
 *             enabled: Boolean
 *            }
 *        }
 *     }
 */
export async function sendUserCreated(user: IUser): Promise<IRabbitMessage> {
    return await sendMessage({
        type: "user-created",
        exchange: "auth2",
        exchangeType: "topic",
        message: {
            userId: user._id,
            date: new Date().valueOf(),
            userData: user
        }
    });
}

/**
 *
 * @api {topic} auth/user-edit Usuario Editado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Envía mensaje user-edit desde Auth con el topic "user-edit".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "user-edit",
 *     "message" : {
 *         "userId": "{userId}",
 *         "date": "{timeStamp}",
 *         "userData": {
 *               "editor": editor,
 *               "target": target,
 *               "changes": changes, (roles added/removed)
 *               "action": action (grant, revoke, enable, disable)
 *           }
 *        }
 *     }
 */
export async function sendUserEdit(editor: string, target: string, changes: string[], action: string): Promise<IRabbitMessage> {
    console.log(`edit user edit ${action}`);
    return await sendMessage({
        type: "user-edit",
        exchange: "auth2",
        exchangeType: "topic",
        message: {
            userId: editor,
            date: new Date().valueOf(),
            userData: {
                editor: editor,
                target: target,
                changes: changes,
                action: action
            }
        }
    });
}

/**
 *
 * @api {topic} auth/user-login Usuario Logueado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Mensajes user-login desde Auth con el topic "user-login".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "user-login",
 *     "message" : {
 *         "userId": "{userId}",
 *         "date": "{timeStamp}",
 *         “action”: “{string}”
 *        }
 *     }
 */
export async function sendUserLogin(editor: string, action: string): Promise<IRabbitMessage> {
    console.log(`edit user login ${action}`);
    return await sendMessage({
        type: "user-login",
        exchange: "auth2",
        exchangeType: "topic",
        message: {
            userId: editor,
            date: new Date().valueOf(),
            message: {
                editor: editor,
                action: action
            }
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

