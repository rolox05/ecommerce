"use strict";

import * as env from "../server/environment";
import * as error from "../server/error";
import { IImageAudit, ImageAudit } from "./schema";
import { resolve } from "path";

const conf = env.getConfig(process.env);

interface ImageRequest {
    imageId: string;
    from: Date;
    to: Date;
}

export function findImageEntries(query: ImageRequest): Promise<IImageAudit[]> {
    return new Promise<IImageAudit[]>((resolve, reject) => {
        ImageAudit.find({
            imageId: query.imageId,
            date: { $gt: query.from, $lt: query.to}
        },
            function (err: any, images: IImageAudit[]) {
                if (err) return reject(err);
                resolve(images);
            });
    });
}

export function findAllImagesEntries(): Promise<IImageAudit[]> {
    return new Promise<IImageAudit[]>((resolve, reject) => {
        ImageAudit.find({
        },
            function (err: any, images: IImageAudit[]) {
                if (err) return reject(err);
                resolve(images);
            });
    });
}
