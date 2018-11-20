"use strict";
/**
 * Servicios internos de Cart, normalmente son llamados por procesos Rabbit o background
 */

import { ImageAudit, IImageAudit } from "./schema";

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
/**
 * Procesa una validación realizada a través de rabbit.
 */
export function imageCreateSaveAuditData(validation: IImageMessage) {
    console.log("RabbitMQ Consume Imagen Create : " + JSON.stringify(validation));
    const imageAuditRegistry = new ImageAudit(validation);
    imageAuditRegistry.save(function (err: any) {
        console.log(err);
    });
}