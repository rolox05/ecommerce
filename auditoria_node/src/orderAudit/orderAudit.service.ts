"use strict";

import * as env from "../server/environment";
import * as error from "../server/error";
import { IOrderAudit, OrderAudit } from "./schema";
import { resolve } from "path";

const conf = env.getConfig(process.env);

interface OrderRequest {
    orderId: string;
    from: Date;
    to: Date;
}

export function findOrderEntries(query: OrderRequest): Promise<IOrderAudit[]> {
    return new Promise<IOrderAudit[]>((resolve, reject) => {
        OrderAudit.find({
            orderId: query.orderId,
            date: { $gt: query.from, $lt: query.to}
        },
            function (err: any, orders: IOrderAudit[]) {
                if (err) return reject(err);
                resolve(orders);
            });
    });
}

export function findAllOrdersEntries(): Promise<IOrderAudit[]> {
    return new Promise<IOrderAudit[]>((resolve, reject) => {
        OrderAudit.find({
        },
            function (err: any, orders: IOrderAudit[]) {
                if (err) return reject(err);
                resolve(orders);
            });
    });
}
