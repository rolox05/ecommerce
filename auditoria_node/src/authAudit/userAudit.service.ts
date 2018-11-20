"use strict";

import * as env from "../server/environment";
import * as error from "../server/error";
import { IUserAudit, UserAudit } from "./schema";
import { resolve } from "path";

const conf = env.getConfig(process.env);

interface UserRequest {
    userId: string;
    from: Date;
    to: Date;
}

export function findUserEntries(query: UserRequest): Promise<IUserAudit[]> {
    return new Promise<IUserAudit[]>((resolve, reject) => {
        UserAudit.find({
            userId: query.userId,
            date: { $gt: query.from, $lt: query.to}
        },
            function (err: any, users: IUserAudit[]) {
                if (err) return reject(err);
                resolve(users);
            });
    });
}

export function findAllUsersEntries(): Promise<IUserAudit[]> {
    return new Promise<IUserAudit[]>((resolve, reject) => {
        UserAudit.find({
        },
            function (err: any, users: IUserAudit[]) {
                if (err) return reject(err);
                resolve(users);
            });
    });
}
