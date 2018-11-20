"use strict";
/**
 * Servicios internos de Cart, normalmente son llamados por procesos Rabbit o background
 */

import { IArticleAudit, ArticleAudit } from "./schema";

interface IArticleMessage {
    userId: string;
    userName: string;
    action: string;
    articleId: string;
    articleName: string;
    date: number;
    articleData?: IArticleData;
    message?: IArticleAction;
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
}
/**
 * Procesa una validación realizada a través de rabbit.
 * Si un articulo no es valido se elimina del cart.
 */
export function articleSaveAuditData(validation: IArticleMessage) {
    console.log("RabbitMQ Consume article message : " + JSON.stringify(validation));
    const articleAuditRegistry = new ArticleAudit(validation);
    articleAuditRegistry.save(function (err: any) {
        console.log(err);
    });
}