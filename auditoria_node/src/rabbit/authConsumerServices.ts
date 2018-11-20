"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import { RabbitDirectConsumer } from "./tools/directConsumer";
import { RabbitDirectEmitter } from "./tools/directEmitter";
import { IRabbitMessage } from "./tools/common";
import { RabbitTopicConsumer } from "./tools/topicConsumer";
import * as validation from "../authAudit/validation";
import { RabbitFanoutConsumer } from "./tools/fanoutConsumer";
import * as jwt from "jsonwebtoken";

interface IUserCreateMessage {
    userId: string;
    date: number;
    userData: IUserData;
    message: IUserAction;
}
class UserCreateMessage implements IUserCreateMessage {
    userId: string;
    date: number;
    userData: IUserData;
    message: IUserAction;
}

class UserAction implements IUserAction {
    user: string;
    action: string;
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

export function init() {
    const userCreate = new RabbitTopicConsumer("user-created", "auth2", "user-created");
    userCreate.addProcessor("user-created", processUserCreated);
    userCreate.init();

    const userEdit = new RabbitTopicConsumer("user-edit", "auth2", "user-edit");
    userEdit.addProcessor("user-edit", processUserEdit);
    userEdit.init();

    const userLogin = new RabbitTopicConsumer("user-login", "auth2", "user-login");
    userLogin.addProcessor("user-login", processUserLogin);
    userLogin.init();

    // const userLogout = new RabbitTopicConsumer("user-logout", "auth2", "user-logout");
    const userLogout = new RabbitFanoutConsumer("auth");
    userLogout.addProcessor("logout", processUserLogout);
    userLogout.init();
}

/**
 *
 * @api {topic} auth/user-created Usuario Creado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes user-created desde Auth con el topic "user-created".
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
function processUserCreated(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IUserCreateMessage;
    validation.userCreateSaveAuditData(message);
}

/**
 *
 * @api {topic} auth/user-edit Usuario Editado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes user-edit desde Auth con el topic "user-edit".
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
function processUserEdit(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IUserCreateMessage;
    validation.userCreateSaveAuditData(message);
}

/**
 *
 * @api {topic} auth/user-login Usuario Logueado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes user-login desde Auth con el topic "user-login".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "user-login/logout",
 *     "message" : {
 *         "userId": "{userId}",
 *         "date": "{timeStamp}",
 *         “action”: “{string}”
 *        }
 *     }
 */

function processUserLogin(rabbitMessage: IRabbitMessage) {
    const message = rabbitMessage.message as IUserCreateMessage;
    validation.userCreateSaveAuditData(message);
}

/**
 *
 * @api {fanout} auth/logout Usuario Deslogueado
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes logout desde Auth con el topic "logout".
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *     "type": "user-login/logout",
 *     "message" : {
 *         "userId": "{userId}",
 *         "date": "{timeStamp}",
 *         “message”: {
 * 	    	 "user": string,
 *  		 "action": string
 *        }
 *       }
 *     }
 */
function processUserLogout(rabbitMessage: IRabbitMessage) {
    const msg = new UserCreateMessage();
    const userData: any = jwt.decode(rabbitMessage.message.split(" ")[1]);
    msg.userId = userData["user_id"];
    msg.message = new UserAction();
    msg.message.action = "logout";
    msg.message.user = userData["user_id"];
    msg.date = new Date().valueOf();
    const message = msg as IUserCreateMessage;
    validation.userCreateSaveAuditData(message);
}